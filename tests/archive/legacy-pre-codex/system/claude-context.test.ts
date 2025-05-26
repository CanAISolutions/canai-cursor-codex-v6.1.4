describe("Claude Agent Context Integrity", () => {
    const context = require("../../cursor/claude-agent-context").claudeContext;
  
    it("contains system memory laws", () => {
      expect(context.memory.systemLaws).toContain("docs/codex-handover.md");
      expect(context.memory.systemLaws).toContain("docs/ideal-cx-thread-v2-emotional-sovereignty.md");
    });
  
    it("enforces fallback logic settings", () => {
      expect(context.memory.fallbackLogic.trustScoreMin).toBeGreaterThanOrEqual(4.0);
      expect(context.memory.fallbackLogic.fallbackChainDepth).toBeGreaterThanOrEqual(1);
    });
  
    it("has required emotional contracts", () => {
      expect(context.memory.emotionalContracts.tone).toMatch(/codex-aligned/);
      expect(context.memory.emotionalContracts.recoveryUX).toBe(true);
    });
  
    it("disallows mocks and enforces Codex", () => {
      expect(context.executionConstraints.mocksPermitted).toBe(false);
      expect(context.executionConstraints.codexEnforced).toBe(true);
    });
  
    it("requires snapshot validation and Cofounder override", () => {
      expect(context.executionConstraints.snapshotValidationRequired).toBe(true);
      expect(context.executionConstraints.overrideRequires).toBe("Cofounder");
    });
  });
  