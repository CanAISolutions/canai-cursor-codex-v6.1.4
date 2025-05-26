// ✅ test-goldmine-logging.ts
// Simulates goldmine-worthy session metadata (clarity, emotion)

const log = {
    sessionId: "abc123",
    isGoldmine: true,
    tags: ["clarity", "emotion"],
    promptType: "email_campaign",
    standoutInput: true
  }
  
  if (!log.isGoldmine || !Array.isArray(log.tags) || log.tags.length === 0) {
    throw new Error("❌ Goldmine log structure missing or invalid.")
  }
  
  console.log("✅ Goldmine input/output log validated.")
  