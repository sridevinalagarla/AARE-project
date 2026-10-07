import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { validateAndNormalizeUrl } from '../services/urlValidator.js';
import { BrowserService } from '../services/browserService.js';
import { AccessibilityScanner } from '../services/accessibilityScanner.js';
import { calculateAccessibilityScore } from '../services/scoreService.js';
import { ScanResult, ApiErrorResponse } from '../types/index.js';
import { ProjectRepository } from '../repositories/projectRepository.js';
import { ScanRepository } from '../repositories/scanRepository.js';
import { AuditRepository } from '../repositories/auditRepository.js';
import { getCachedScan, setCachedScan } from '../config/redis.js';

export const scanRouter = Router();

// Rate limiter: 30 scans per 60 seconds per IP address
const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many scan requests. Please try again in a minute.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * GET /api/scans
 * Returns persistent scan history from PostgreSQL.
 */
scanRouter.get('/scans', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const history = await ScanRepository.getHistory(limit, offset);
    return res.json({ success: true, scans: history });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/scans/:id
 * Returns a specific scan with violations from PostgreSQL.
 */
scanRouter.get('/scans/:id', async (req: Request, res: Response) => {
  try {
    const scan = await ScanRepository.getById(req.params.id);
    if (!scan) {
      return res.status(404).json({ success: false, error: 'Scan not found' });
    }
    return res.json({ success: true, scan });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/scan
 * Scans an external public website URL and persists to PostgreSQL & Redis.
 */
scanRouter.post('/scan', scanLimiter, async (req: Request, res: Response<ScanResult | ApiErrorResponse>) => {
  const startTime = Date.now();
  const { url, bypassCache } = req.body || {};

  // 1. URL validation & SSRF verification
  const validation = await validateAndNormalizeUrl(url);
  if (!validation.valid || !validation.normalizedUrl) {
    return res.status(400).json({
      success: false,
      error: validation.error || 'Please enter a valid public website URL.',
      code: validation.code || 'INVALID_URL',
    });
  }

  const targetUrl = validation.normalizedUrl;

  // 2. Check Redis Cache (120s TTL)
  if (!bypassCache) {
    const cached = await getCachedScan(targetUrl);
    if (cached) {
      return res.json({
        ...cached,
        fromCache: true,
      });
    }
  }

  let browserSession;

  try {
    // 3. PostgreSQL: Find or create Project
    const project = await ProjectRepository.findOrCreateByUrl(targetUrl);
    
    // 4. PostgreSQL: Create Scan Record with status SCANNING
    const scanRecord = await ScanRepository.createScan(project.id, targetUrl);

    // 5. Browser Automation & Analysis
    browserSession = await BrowserService.createSession();
    const { pageTitle } = await BrowserService.navigateToUrl(browserSession.page, targetUrl);
    const rawResults = await AccessibilityScanner.scanPage(browserSession.page);

    // 6. Calculate Health Score
    const scoreResult = calculateAccessibilityScore(
      rawResults.violations,
      rawResults.passes,
      rawResults.incomplete.length
    );

    const durationMs = Date.now() - startTime;

    const responsePayload: ScanResult = {
      success: true,
      url: targetUrl,
      projectId: project.id,
      score: scoreResult.score,
      summary: scoreResult.summary,
      severityBreakdown: scoreResult.severityBreakdown,
      violations: rawResults.violations,
      passes: rawResults.passes,
      incomplete: rawResults.incomplete,
      timestamp: new Date().toISOString(),
      duration: durationMs / 1000,
      durationMs,
      pageTitle,
      disclaimer: scoreResult.disclaimer,
    };

    // 7. PostgreSQL: Update Scan to COMPLETED and insert Violations
    await ScanRepository.completeScan(scanRecord.id, responsePayload);
    await ProjectRepository.updateScore(project.id, scoreResult.score);

    // 8. Redis: Cache result with 120s TTL
    await setCachedScan(targetUrl, responsePayload, 120);

    // 9. PostgreSQL: Audit Trail
    await AuditRepository.log(
      'SCAN_COMPLETED',
      'Scan',
      scanRecord.id,
      { score: scoreResult.score, violations: rawResults.violations.length },
      project.id
    );

    return res.json(responsePayload);
  } catch (scanErr: any) {
    console.error(`[Scan Error] ${targetUrl}:`, scanErr.message);

    let statusCode = 500;
    let friendlyMessage = scanErr.message || 'Unable to scan this website.';

    if (
      friendlyMessage.includes('too long') ||
      friendlyMessage.includes('timeout') ||
      friendlyMessage.includes('Timeout')
    ) {
      statusCode = 504;
      friendlyMessage = 'Website took too long to respond.';
    } else if (friendlyMessage.includes('DNS') || friendlyMessage.includes('ENOTFOUND')) {
      statusCode = 502;
      friendlyMessage = 'Unable to reach this website. DNS resolution failed.';
    } else if (friendlyMessage.includes('Secure connection') || friendlyMessage.includes('SSL')) {
      statusCode = 502;
      friendlyMessage = 'Secure connection could not be established.';
    } else if (friendlyMessage.includes('blocking')) {
      statusCode = 403;
      friendlyMessage = 'This website could not be scanned.';
    }

    return res.status(statusCode).json({
      success: false,
      error: friendlyMessage,
      code: 'SCAN_FAILED',
      details: process.env.NODE_ENV === 'development' ? scanErr.stack : undefined,
    });
  } finally {
    if (browserSession) {
      await browserSession.close();
    }
  }
});

/**
 * POST /api/scan-demo
 * Runs scan on the demo test page and persists in PostgreSQL & Redis.
 */
scanRouter.post('/scan-demo', scanLimiter, async (req: Request, res: Response<ScanResult | ApiErrorResponse>) => {
  const startTime = Date.now();
  const port = process.env.PORT || 3001;
  const demoUrl = `http://127.0.0.1:${port}/demo.html`;

  let browserSession;

  try {
    const project = await ProjectRepository.findOrCreateByUrl(
      'http://127.0.0.1:3001/demo.html',
      'Inaccessible React Showcase'
    );
    const scanRecord = await ScanRepository.createScan(project.id, demoUrl);

    browserSession = await BrowserService.createSession();
    const { pageTitle } = await BrowserService.navigateToUrl(browserSession.page, demoUrl);
    const rawResults = await AccessibilityScanner.scanPage(browserSession.page);
    const scoreResult = calculateAccessibilityScore(
      rawResults.violations,
      rawResults.passes,
      rawResults.incomplete.length
    );

    const durationMs = Date.now() - startTime;

    const responsePayload: ScanResult = {
      success: true,
      url: 'https://demo-nexus-retail.proofa11y.engine (Interactive Accessibility Test Page)',
      projectId: project.id,
      score: scoreResult.score,
      summary: scoreResult.summary,
      severityBreakdown: scoreResult.severityBreakdown,
      violations: rawResults.violations,
      passes: rawResults.passes,
      incomplete: rawResults.incomplete,
      timestamp: new Date().toISOString(),
      duration: durationMs / 1000,
      durationMs,
      pageTitle: pageTitle || 'Nexus Retail Demo Portal',
      disclaimer: scoreResult.disclaimer,
    };

    await ScanRepository.completeScan(scanRecord.id, responsePayload);
    await ProjectRepository.updateScore(project.id, scoreResult.score);
    await setCachedScan(demoUrl, responsePayload, 120);

    return res.json(responsePayload);
  } catch (demoErr: any) {
    console.error('[Demo Scan Error]:', demoErr);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete scan on the demo test page.',
      code: 'DEMO_SCAN_FAILED',
    });
  } finally {
    if (browserSession) {
      await browserSession.close();
    }
  }
});
