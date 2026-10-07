import { chromium, Browser, BrowserContext, Page } from 'playwright';

export interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  close: () => Promise<void>;
}

export class BrowserService {
  private static sharedBrowser: Browser | null = null;

  /**
   * Returns a singleton headless Chromium browser instance.
   * Reusing the browser process drastically improves scan speed (target 2-5s).
   */
  public static async getSharedBrowser(): Promise<Browser> {
    if (!this.sharedBrowser || !this.sharedBrowser.isConnected()) {
      this.sharedBrowser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--disable-background-networking',
          '--disable-sync',
          '--no-first-run',
          '--hide-scrollbars',
        ],
      });
    }
    return this.sharedBrowser;
  }

  /**
   * Initializes an isolated browser context and page for a scan request.
   */
  public static async createSession(): Promise<BrowserSession> {
    const browser = await this.getSharedBrowser();

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 AccessFixAI/1.0',
      bypassCSP: true, // Enables axe-core injection on pages with strict CSP
      ignoreHTTPSErrors: true, // Prevents certificate handshake aborts on valid public test sites
    });

    const page = await context.newPage();

    // Block non-essential tracking and heavy video streaming to speed up scans
    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      const url = route.request().url().toLowerCase();

      // Block heavy video, audio, analytics trackers
      if (
        resourceType === 'media' ||
        url.includes('google-analytics.com') ||
        url.includes('googletagmanager.com') ||
        url.includes('doubleclick.net') ||
        url.includes('facebook.net') ||
        url.includes('hotjar.com')
      ) {
        return route.abort();
      }
      return route.continue();
    });

    // Set responsive timeouts
    page.setDefaultTimeout(18000);
    page.setDefaultNavigationTimeout(18000);

    const close = async () => {
      try {
        await page.close().catch(() => {});
        await context.close().catch(() => {});
      } catch (err) {
        console.error('Error closing scan context:', err);
      }
    };

    return { browser, context, page, close };
  }

  /**
   * Navigates to target URL quickly with domcontentloaded and brief render settlement.
   */
  public static async navigateToUrl(page: Page, url: string): Promise<{ pageTitle: string }> {
    try {
      // Use domcontentloaded for fast 2-4 second turnaround
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      // Brief settling time for client-side frameworks to render DOM nodes
      await page.waitForTimeout(500).catch(() => {});
    } catch (primaryErr: any) {
      const errMsg = primaryErr?.message || '';

      if (errMsg.includes('timeout') || errMsg.includes('Timeout')) {
        // Check if page DOM at least has a body to inspect
        const hasBody = await page.evaluate(() => !!document.body).catch(() => false);
        if (!hasBody) {
          throw new Error('Website took too long to respond.');
        }
      } else if (errMsg.includes('net::ERR_NAME_NOT_RESOLVED') || errMsg.includes('ENOTFOUND')) {
        throw new Error('Unable to reach this website. DNS resolution failed.');
      } else if (errMsg.includes('net::ERR_CONNECTION_REFUSED') || errMsg.includes('ECONNREFUSED')) {
        throw new Error('Unable to reach this website. Connection refused by server.');
      } else if (errMsg.includes('net::ERR_CERT_') || errMsg.includes('SSL')) {
        throw new Error('Secure connection could not be established.');
      } else if (errMsg.includes('net::ERR_BLOCKED_BY_CLIENT') || errMsg.includes('net::ERR_ABORTED')) {
        throw new Error('This website could not be scanned.');
      } else {
        throw new Error(`Unable to scan this website: ${errMsg.split('\n')[0]}`);
      }
    }

    let pageTitle = '';
    try {
      pageTitle = await page.title();
    } catch {
      pageTitle = 'Untitled Webpage';
    }

    return { pageTitle: pageTitle || 'Webpage' };
  }
}
