import { Logger } from '../../utils/logger';

/**
 * notifyGuardians - Sends a notification to system guardians.
 * WHAT: Notifies guardians of critical self-healing or fallback events.
 * WHY: Ensures all critical events are auditable and trigger human/agent review.
 * HOW: Logs the notification using the Logger utility (context: 'guardian-notify').
 */
export async function notifyGuardians(message: string): Promise<void> {
  const logger = new Logger('guardian-notify');
  try {
    // Log the notification in CodexMarkdownV2.1 format
    const entry = `- **Guardian Notification:** ${message}\n- **Timestamp:** ${new Date().toISOString()}\n`;
    logger.info(entry);
  } catch (err) {
    // Log any errors in notification delivery
    logger.error('Failed to notify guardians', err);
  }
} 