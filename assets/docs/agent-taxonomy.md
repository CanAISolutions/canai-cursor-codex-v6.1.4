
# Agent Taxonomy

> Source: *Advances and Challenges in Foundation Agents* (arXiv:2504.01990, Apr‑2025)

## Formal definition
> An **AI agent** is a system that perceives an environment, maintains internal state (memory), reasons about future trajectories and goals, and executes actions that transform the environment, while learning from the consequences of its behaviour.

## Cognitive modules
| Brain analogue | Agent subsystem | CanAI mapping |
| --- | --- | --- |
| Sensory Cortex | Perception / Tool wrappers | Input parsers, PromptLogs enrichment |
| Hippocampus | Short‑term episodic memory | `EpisodicMemory` table (new) |
| Neocortex | Semantic long‑term memory | `SemanticMemory` table (new) |
| Basal Ganglia | Action selection / policy | Prompt router, Action‑Agent |
| Cerebellum | Skill refinement | Self‑Refine Layer |
| Dopaminergic system | Reward & feedback | `SmartPromptScore`, FeedbackLogs |

## Design principles for CanAI
1. Explicit memory separation (episodic vs semantic).
2. Measure reasoning depth and tool‑graph width.
3. Treat actions (publish, email, deploy) as first‑class outputs with safety rails.
