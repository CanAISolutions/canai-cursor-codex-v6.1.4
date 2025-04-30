# Copilot Feedback Logging

## Purpose
Ensure every feedback action is logged with enough detail to enable audits, troubleshooting, and fine-tuning of feedback behavior.

## Logging Criteria
1. **Session ID**: Every feedback event should be logged with the session ID it applies to.
2. **Trigger Event**: Log the specific trigger event that caused the feedback to be triggered (e.g., "low-emotion", "high-revisions").
3. **Feedback Message**: The exact message or suggestion triggered.
4. **Timestamp**: Log the exact time of the feedback trigger.

## Log Example:
{ "sessionId": "session-001", "triggerEvent": "low-emotion", "feedbackMessage": "Try adjusting your tone to be more engaging.", "timestamp": "2025-04-30T10:00:00Z" }