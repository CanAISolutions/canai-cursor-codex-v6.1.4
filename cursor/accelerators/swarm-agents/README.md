# 🐝 Swarm Agents Coordination Layer

A modular system for running multiple agents in tandem to produce richer, more reliable, emotionally safe outputs.

---

## Modes

- `parallel-vote`: All agents run → best output wins
- `sequential-refine`: One agent builds on the next
- `fallback-cascade`: Run one agent → switch if weak

---

## Copilot Usage

```ts
const result = await runSwarmAgents("Draft a high-emotion landing page", "parallel-vote")
