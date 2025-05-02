```md
# CanAI Accelerators

This folder contains the Codex-locked accelerator modules that power CanAI’s adaptive subsystems.  
Each subfolder is a standalone accelerator with its own CI-guarded checklist.

## Available Accelerators

| Name                       | Path                                      | Purpose (one-liner)                                     |
|----------------------------|-------------------------------------------|---------------------------------------------------------|
| auto-rollback              | `/cursor/accelerators/auto-rollback`      | Detect & revert on mutation drift.                      |
| conversion-predictor-lite  | `/cursor/accelerators/conversion-predictor-lite` | Estimate conversion likelihood in real time.  |
| copilot-feedback-agent     | `/cursor/accelerators/copilot-feedback-agent`    | Capture & process Copilot session feedback.     |
| copilot-injector           | `/cursor/accelerators/copilot-injector`          | Inject contextual suggestions into Copilot.      |
| emotional-foresight-lite   | `/cursor/accelerators/emotional-foresight-lite` | Anticipate emotional state & intervene.         |
| federated-memory-lite      | `/cursor/accelerators/federated-memory-lite`    | Federate memory with conflict resolution.        |
| prompt-genetics            | `/cursor/accelerators/prompt-genetics`          | Evolve prompts via genetic algorithms.           |
| reverse-synthesis-core     | `/cursor/accelerators/reverse-synthesis-core`   | Deconstruct & recombine prompt patterns.        |
| smart-prompt-score         | `/cursor/accelerators/smart-prompt-score`       | Score prompt efficacy for QA loops.             |
| swarm-agents               | `/cursor/accelerators/swarm-agents`             | Coordinate multi-agent distributed planning.    |
| tone-override-agent        | `/cursor/accelerators/tone-override-agent`      | Dynamically adjust response tone.               |
| zombie-hunter              | `/cursor/accelerators/zombie-hunter`            | Neutralize orphaned/unresponsive agents.        |

> **CI Gate**: Running `systemReadiness()` in each subfolder must return **green** before any release.
```
