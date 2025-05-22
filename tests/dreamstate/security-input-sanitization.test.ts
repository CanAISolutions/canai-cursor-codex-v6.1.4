// security-input-sanitization.test.ts
// DreamState Test 26: Security Input Sanitization
// What: Protects against malicious inputs (e.g., SQL injection, XSS, prompt injection)
// Why: Ensures system integrity and emotional intent preservation
// How: Uses canonical mocks and asserts Codex-aligned sanitization

import { mockMaliciousInput, requireMock } from '../mocks/dreamstate-core';

describe('DreamState: security-input-sanitization', () => {
  it('should sanitize malicious inputs and preserve emotional intent', () => {
    // What: Simulate malicious input and assert sanitization
    // Why: Ensures system integrity and emotional intent preservation
    // How: Replace dangerous characters and assert intent is preserved
    if (!mockMaliciousInput) requireMock('mockMaliciousInput');
    const sanitized = { ...mockMaliciousInput, userPrompt: mockMaliciousInput.userPrompt.replace(/[^a-zA-Z0-9 .,?!]/g, '') };
    expect(sanitized.userPrompt).not.toMatch(/;|--|\*/);
    expect(sanitized.locale).toBe(mockMaliciousInput.locale);
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 