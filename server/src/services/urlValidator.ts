import { URL } from 'node:url';
import dns from 'node:dns/promises';

export interface ValidationResult {
  valid: boolean;
  normalizedUrl?: string;
  error?: string;
  code?: 'INVALID_URL' | 'UNSUPPORTED_PROTOCOL' | 'SSRF_BLOCKED' | 'DNS_RESOLUTION_FAILED';
}

/**
 * Checks if an IPv4 address belongs to a private, loopback, or reserved range.
 */
export function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return false;
  }

  const [a, b] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;
  // 10.0.0.0/8 (Private network)
  if (a === 10) return true;
  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;
  // 169.254.0.0/16 (Link-local / AWS instance metadata)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12 (Private network: 172.16.0.0 - 172.31.255.255)
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16 (Private network)
  if (a === 192 && b === 168) return true;
  // 100.64.0.0/10 (Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 (TEST-NET)
  if (a === 192 && b === 0 && parts[2] === 2) return true;
  if (a === 198 && b === 51 && parts[2] === 100) return true;
  if (a === 203 && b === 0 && parts[2] === 113) return true;
  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
  if (a >= 224) return true;

  return false;
}

/**
 * Checks if an IPv6 address belongs to private or loopback ranges.
 */
export function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '::') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // Unique local (fc00::/7)
  if (normalized.startsWith('fe80:')) return true; // Link local (fe80::/10)
  if (normalized.startsWith('::ffff:')) {
    // IPv4-mapped IPv6
    const ipv4 = normalized.substring('::ffff:'.length);
    return isPrivateIPv4(ipv4);
  }
  return false;
}

/**
 * Validates a user-supplied URL and verifies it is safe against SSRF attacks.
 */
export async function validateAndNormalizeUrl(
  inputUrl: string,
  options: { allowLocalDemo?: boolean } = {}
): Promise<ValidationResult> {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { valid: false, error: 'Please enter a valid website URL.', code: 'INVALID_URL' };
  }

  const trimmed = inputUrl.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter a valid website URL.', code: 'INVALID_URL' };
  }

  let parsed: URL;
  try {
    // If protocol is missing, reject or require valid scheme
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return {
        valid: false,
        error: 'Please enter a valid website URL starting with http:// or https:// (e.g., https://example.com)',
        code: 'INVALID_URL',
      };
    }
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'Please enter a valid website URL.', code: 'INVALID_URL' };
  }

  // Check scheme
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      valid: false,
      error: 'Unsupported URL protocol. Only HTTP and HTTPS are permitted.',
      code: 'UNSUPPORTED_PROTOCOL',
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // If local demo is allowed explicitly (e.g. for internal test route)
  if (options.allowLocalDemo && (hostname === 'localhost' || hostname === '127.0.0.1')) {
    return {
      valid: true,
      normalizedUrl: parsed.toString(),
    };
  }

  // Block localhost & loopback names
  if (
    hostname === 'localhost' ||
    hostname === 'localhost.localdomain' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '::1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.home.arpa')
  ) {
    return {
      valid: false,
      error: 'Scanning localhost or internal addresses is blocked for security reasons.',
      code: 'SSRF_BLOCKED',
    };
  }

  // Direct IP checks
  if (isPrivateIPv4(hostname) || isPrivateIPv6(hostname)) {
    return {
      valid: false,
      error: 'Scanning private or local IP ranges is blocked for security reasons.',
      code: 'SSRF_BLOCKED',
    };
  }

  // Must have a valid dot for external domains (e.g. example.com)
  if (!hostname.includes('.')) {
    return {
      valid: false,
      error: 'Please enter a valid website URL with a complete domain name (e.g., https://example.com).',
      code: 'INVALID_URL',
    };
  }

  // Resolve hostname via DNS to prevent DNS rebinding to private IPs
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    if (!addresses || addresses.length === 0) {
      return {
        valid: false,
        error: 'Unable to reach this website. DNS resolution failed.',
        code: 'DNS_RESOLUTION_FAILED',
      };
    }

    for (const record of addresses) {
      if (record.family === 4 && isPrivateIPv4(record.address)) {
        return {
          valid: false,
          error: 'The specified domain resolves to a private IP address and cannot be scanned.',
          code: 'SSRF_BLOCKED',
        };
      }
      if (record.family === 6 && isPrivateIPv6(record.address)) {
        return {
          valid: false,
          error: 'The specified domain resolves to a private IPv6 address and cannot be scanned.',
          code: 'SSRF_BLOCKED',
        };
      }
    }
  } catch (err: any) {
    // If DNS resolution fails outright (ENOTFOUND, EAI_AGAIN, etc.)
    return {
      valid: false,
      error: `Unable to reach this website (${err.code || 'DNS Error'}). Please verify the domain is online and publicly accessible.`,
      code: 'DNS_RESOLUTION_FAILED',
    };
  }

  return {
    valid: true,
    normalizedUrl: parsed.toString(),
  };
}
