
# Action-Agent (Prototype)

Publishes completed deliverables (e.g. Social Content Pack) directly to a hidden Webflow Collection.

## Environment Variables

| Var | Purpose |
| --- | --- |
| `WEBFLOW_ACCESS_TOKEN` | Personal access token with **Site** > **Full CMS permissions** |
| `WEBFLOW_COLLECTION_ID` | Target collection ID |
| `WEBFLOW_SITE_ID` | Site ID (for publish step, if enabled) |

## Run locally

```bash
pnpm install
pnpm ts-node publishToWebflow.ts
```
