// cursor/claude-agent-context.ts
// Purpose: Structured memory injection context for Claude 3.7 Sonnet agent
// Activated: 2025-05-21 — per Sonnet Transition Log
// Codex Status: Immutable unless revoked by Cofounder

export const claudeContext = {
    memory: {
      systemLaws: [
        "docs/codex-handover.md",
        "docs/ideal-cx-thread-v2-emotional-sovereignty.md",
        "cursor/auto-actions.log.md"
      ],
      fallbackLogic: {
        trustScoreMin: 4.2,
        driftSensitivity: "high",
        fallbackChainDepth: 3,
        multilingualToneRecovery: true
      },
      emotionalContracts: {
        tone: "codex-aligned, emotionally intelligent, operator-grade",
        recoveryUX: true,
        volatilityAcknowledgementRequired: true
      }
    },
  
    fileContext: {
      activeFile: "auto-injected by Cursor runtime",
      visibleFiles: "streamed via Cursor agent hooks",
      fallbackState: "passed from CI or DreamState runner"
    },
  
    executionConstraints: {
      mocksPermitted: false,
      codexEnforced: true,
      logAllDelta: true,
      snapshotValidationRequired: true,
      overrideRequires: "Cofounder"
    }
  };
  