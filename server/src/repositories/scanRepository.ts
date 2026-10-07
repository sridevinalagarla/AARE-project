import { prisma } from '../config/database.js';
import { ScanResult, AccessibilityViolation } from '../types/index.js';
import { DbStore } from '../engines/storage/dbStore.js';

export class ScanRepository {
  static async createScan(projectId: string, url: string): Promise<any> {
    try {
      return await prisma.scan.create({
        data: {
          projectId,
          url,
          status: 'SCANNING',
          score: 0,
        },
      });
    } catch {
      return {
        id: `scan-${Date.now().toString(36)}`,
        projectId,
        url,
        status: 'SCANNING',
      };
    }
  }

  static async completeScan(scanId: string, result: ScanResult): Promise<any> {
    try {
      // 1. Update Scan
      const updated = await prisma.scan.update({
        where: { id: scanId },
        data: {
          status: 'COMPLETED',
          score: result.score,
          totalViolations: result.violations.length,
          totalPasses: result.passes.length,
          totalIncomplete: result.incomplete.length,
          criticalCount: result.severityBreakdown.critical,
          seriousCount: result.severityBreakdown.serious,
          moderateCount: result.severityBreakdown.moderate,
          minorCount: result.severityBreakdown.minor,
          duration: result.duration || result.durationMs / 1000,
          completedAt: new Date(),
        },
      });

      // 2. Persist Violations in batch
      if (result.violations.length > 0) {
        for (const v of result.violations) {
          await prisma.violation.create({
            data: {
              scanId,
              ruleId: v.id,
              impact: v.impact,
              wcagCriteria: v.wcagCriteria?.map((c: any) => c.id || c) || [],
              description: v.description,
              help: v.help,
              helpUrl: v.helpUrl,
              tags: v.tags,
              affectedNodes: v.nodes as any,
              sourceHtml: v.nodes?.[0]?.html || '',
              target: v.nodes?.[0]?.target?.join(', ') || '',
              status: 'OPEN',
            },
          });
        }
      }

      // Sync local store
      DbStore.saveScan(result);

      return updated;
    } catch (err) {
      DbStore.saveScan(result);
      return result;
    }
  }

  static async getHistory(limit: number = 20, offset: number = 0): Promise<any[]> {
    try {
      const records = await prisma.scan.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: { name: true, framework: true, sourceType: true },
          },
        },
      });

      return records.map((s: any) => ({
        id: s.id,
        projectId: s.projectId,
        projectName: s.project?.name || 'Project',
        url: s.url,
        score: s.score,
        status: s.status,
        summary: {
          critical: s.criticalCount || 0,
          serious: s.seriousCount || 0,
          moderate: s.moderateCount || 0,
          minor: s.minorCount || 0,
          totalViolations: s.totalViolations || 0,
          passes: s.totalPasses || 0,
        },
        duration: s.duration || 0,
        createdAt: s.createdAt,
        completedAt: s.completedAt,
      }));
    } catch {
      return DbStore.getAllScans()
        .slice(offset, offset + limit)
        .map((s: any) => ({
          id: s.projectId || 'demo-scan',
          url: s.url,
          pageTitle: s.pageTitle,
          score: s.score,
          status: 'COMPLETED',
          summary: {
            critical: s.severityBreakdown?.critical || 0,
            serious: s.severityBreakdown?.serious || 0,
            moderate: s.severityBreakdown?.moderate || 0,
            minor: s.severityBreakdown?.minor || 0,
            totalViolations: s.summary?.violations || s.violations?.length || 0,
            passes: s.summary?.passes || s.passes?.length || 0,
          },
          duration: s.duration || (s.durationMs ? s.durationMs / 1000 : 0),
          timestamp: s.timestamp || new Date().toISOString(),
        }));
    }
  }

  static async getById(id: string): Promise<any | null> {
    try {
      return await prisma.scan.findUnique({
        where: { id },
        include: {
          violations: true,
          project: true,
        },
      });
    } catch {
      return DbStore.getScan(id) || null;
    }
  }
}

