import { ScanResult, ScanHistoryItem } from '../types';

const STORAGE_KEY = 'accessfix_scan_history_v1';

export function getScanHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read scan history from localStorage:', err);
    return [];
  }
}

export function saveScanToHistory(result: ScanResult): ScanHistoryItem[] {
  try {
    const history = getScanHistory();
    const newItem: ScanHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: result.url,
      pageTitle: result.pageTitle,
      score: result.score,
      totalViolations: result.violations.length,
      criticalCount: result.severityBreakdown.critical,
      timestamp: result.timestamp,
      resultData: result,
    };

    // Keep the most recent 25 scans, filtering duplicates if same URL was scanned right now
    const updated = [newItem, ...history.filter(h => h.url !== result.url || (Date.now() - new Date(h.timestamp).getTime()) > 30000)].slice(0, 25);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save scan to localStorage:', err);
    return getScanHistory();
  }
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}
