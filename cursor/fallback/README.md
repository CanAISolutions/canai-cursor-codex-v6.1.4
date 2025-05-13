# cursor/fallback

This folder contains the fallback error handling logic for CanAI. It ensures that any system-level GPT, API, or agent failures are routed through a controlled pathway, logged safely, and handled without breaking the user experience.

## Files
- `fallback-handler.ts`: Main error routing logic
- `intent-token.json`: Declares fallback contract
- `log-expectation.md`: Specifies required logs for fallback activations

All fallback scenarios must be:
- Routed through `fallback-handler.ts`
- Logged in `PromptLogs` and `auto-actions.log.md`
- Reflected in user-facing graceful error messages (via Webflow or Render)

## Ownership
Codex Agent: Sentinel • Maintainer: Systems Steward
