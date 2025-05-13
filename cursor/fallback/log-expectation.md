## Logging Requirements for Fallback Events

Every fallback activation must log:
- `timestamp`
- `originating module`
- `fallback route used`
- `user impact level`
- `logged status` in `PromptLogs` and `auto-actions.log.md`

### Sample Log
```json
{
  "module": "gpt-handler.ts",
  "error": "OpenAI API 429",
  "route": "retry after 5s",
  "userImpact": "minimal",
  "loggedAt": "auto-actions.log.md"
}
``` 