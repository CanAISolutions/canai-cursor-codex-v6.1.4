/**
 * @file lib/scripts/output-formatter.ts
 * @description Emotionally-aware output formatting
 * @version 6.1.4
 */

export class OutputFormatter {
  async format(data: any, type: 'success' | 'error'): Promise<string> {
    if (type === 'success') {
      if (data.operation === 'test:complete') {
        return `✨ All tests passed! ${data.metrics.passed} tests completed in ${data.metrics.duration}`;
      }
      return `✨ Operation completed successfully`;
    }

    if (type === 'error') {
      if (data.operation === 'build:failed') {
        return `Let me help you resolve this build error: ${data.error.message}`;
      }
      return `I noticed an issue - let's work through this together`;
    }

    return 'Operation completed';
  }
} 