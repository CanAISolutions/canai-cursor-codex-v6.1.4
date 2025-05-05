/**
 * @file shell-utils.test.ts
 * @description Unit tests for secure shell utilities used in the debugging agent.
 * Validates command sanitization, allowlist enforcement, mockable exec, and pipeline health.
 */

import {
    sanitizeShellInput,
    isSafeShellCommand,
    execAsync,
    checkPipelineHealth,
    testOverrides,
  } from '../shell-utils';
  
  import { jest } from '@jest/globals';
  
  describe('sanitizeShellInput', () => {
    it('allows safe commands', () => {
      const safe = 'git status';
      expect(() => sanitizeShellInput(safe)).not.toThrow();
    });
  
    it('rejects unsafe shell symbols', () => {
      const unsafeSymbols = ['&&', '||', ';', '`', '|', '$(', '>>', '<'];
      for (const symbol of unsafeSymbols) {
        expect(() => sanitizeShellInput(`echo ${symbol} dangerous`)).toThrow(/INVALID_SHELL_INPUT/);
      }
    });
  });
  
  describe('isSafeShellCommand', () => {
    it('permits known Git commands', () => {
      expect(isSafeShellCommand('git status')).toBe(true);
      expect(isSafeShellCommand('git checkout main')).toBe(true);
    });
  
    it('blocks unknown or unsafe commands', () => {
      expect(isSafeShellCommand('rm -rf /')).toBe(false);
      expect(isSafeShellCommand('node evil.js')).toBe(false);
    });
  });
  
  describe('execAsync', () => {
    beforeEach(() => {
      testOverrides.execAsync = jest.fn().mockResolvedValue({ stdout: 'OK', stderr: '' });
    });
  
    afterEach(() => {
      testOverrides.execAsync = null;
    });
  
    it('executes safe commands successfully', async () => {
      const result = await execAsync('git status');
      expect(result.stdout).toBe('OK');
      expect(testOverrides.execAsync).toHaveBeenCalled();
    });
  
    it('rejects disallowed commands', async () => {
      await expect(execAsync('rm -rf /')).rejects.toThrow(/DISALLOWED_COMMAND/);
    });
  
    it('throws on unsafe shell input', async () => {
      await expect(execAsync('git status && rm -rf /')).rejects.toThrow(/INVALID_SHELL_INPUT/);
    });
  });
  
  describe('checkPipelineHealth', () => {
    beforeEach(() => {
      testOverrides.execAsync = jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ stdout: 'git version 2.39.0', stderr: '' }))
        .mockImplementationOnce(() => Promise.resolve({ stdout: 'main', stderr: '' }));
    });
  
    afterEach(() => {
      testOverrides.execAsync = null;
    });
  
    it('passes when Git is detected and branch is valid', async () => {
      const result = await checkPipelineHealth('trace-abc');
      expect(result).toBe(true);
    });
  
    it('warns if in detached HEAD', async () => {
      testOverrides.execAsync = jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ stdout: 'git version 2.39.0', stderr: '' }))
        .mockImplementationOnce(() => Promise.resolve({ stdout: 'HEAD', stderr: '' }));
  
      const result = await checkPipelineHealth('trace-detached');
      expect(result).toBe(true);
    });
  
    it('fails gracefully if Git is unavailable', async () => {
      testOverrides.execAsync = jest.fn().mockRejectedValue(new Error('Git not found'));
  
      const result = await checkPipelineHealth('trace-missing-git');
      expect(result).toBe(false);
    });
  });
  