import { describe, it, expect } from 'vitest';
import { validateAndNormalizeUrl, isPrivateIPv4, isPrivateIPv6 } from '../src/services/urlValidator.js';

describe('URL Validator & SSRF Protection', () => {
  it('should validate valid public HTTPS URLs', async () => {
    const result = await validateAndNormalizeUrl('https://example.com');
    expect(result.valid).toBe(true);
    expect(result.normalizedUrl).toBe('https://example.com/');
  });

  it('should validate valid public HTTP URLs', async () => {
    const result = await validateAndNormalizeUrl('http://example.com/test');
    expect(result.valid).toBe(true);
    expect(result.normalizedUrl).toBe('http://example.com/test');
  });

  it('should reject empty or whitespace URLs', async () => {
    const emptyResult = await validateAndNormalizeUrl('');
    expect(emptyResult.valid).toBe(false);
    expect(emptyResult.error).toBe('Please enter a valid website URL.');

    const spaceResult = await validateAndNormalizeUrl('   ');
    expect(spaceResult.valid).toBe(false);
  });

  it('should reject URLs without http/https protocol', async () => {
    const result = await validateAndNormalizeUrl('example');
    expect(result.valid).toBe(false);

    const result2 = await validateAndNormalizeUrl('hello');
    expect(result2.valid).toBe(false);
  });

  it('should reject file:// and javascript: protocols', async () => {
    const fileResult = await validateAndNormalizeUrl('file:///etc/passwd');
    expect(fileResult.valid).toBe(false);

    const jsResult = await validateAndNormalizeUrl('javascript:alert(1)');
    expect(jsResult.valid).toBe(false);
  });

  it('should reject localhost and 127.0.0.1 (SSRF)', async () => {
    const localhostRes = await validateAndNormalizeUrl('http://localhost:3000');
    expect(localhostRes.valid).toBe(false);
    expect(localhostRes.code).toBe('SSRF_BLOCKED');

    const ipRes = await validateAndNormalizeUrl('http://127.0.0.1:8080');
    expect(ipRes.valid).toBe(false);
    expect(ipRes.code).toBe('SSRF_BLOCKED');
  });

  it('should identify private IPv4 ranges', () => {
    expect(isPrivateIPv4('10.0.0.1')).toBe(true);
    expect(isPrivateIPv4('192.168.1.1')).toBe(true);
    expect(isPrivateIPv4('172.16.0.5')).toBe(true);
    expect(isPrivateIPv4('172.31.255.255')).toBe(true);
    expect(isPrivateIPv4('169.254.169.254')).toBe(true);
    expect(isPrivateIPv4('127.0.0.1')).toBe(true);
    expect(isPrivateIPv4('8.8.8.8')).toBe(false);
    expect(isPrivateIPv4('93.184.216.34')).toBe(false);
  });

  it('should identify private IPv6 ranges', () => {
    expect(isPrivateIPv6('::1')).toBe(true);
    expect(isPrivateIPv6('fe80::1')).toBe(true);
    expect(isPrivateIPv6('fc00::1')).toBe(true);
    expect(isPrivateIPv6('2606:2800:220:1:248:1893:25c8:1946')).toBe(false);
  });

  it('allows local demo URL when explicitly permitted', async () => {
    const demoRes = await validateAndNormalizeUrl('http://localhost:3001/demo.html', { allowLocalDemo: true });
    expect(demoRes.valid).toBe(true);
  });
});
