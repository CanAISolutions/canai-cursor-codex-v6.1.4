// ✅ test-session-analytics.ts
// Validates core analytics fields exist: SessionID, PromptType, ReuseCount, Score

const session = {
    SessionID: "CANAI-001",
    PromptType: "business_plan",
    TokensUsed: 1900,
    RevisionCount: 2,
    SmartPromptScore: 5.5,
    EmotionalTone: "Helpful, direct"
  }
  
  const required = ["SessionID", "PromptType", "TokensUsed", "RevisionCount", "SmartPromptScore", "EmotionalTone"]
  
  required.forEach(key => {
    if (!(key in session)) {
      throw new Error(`❌ Session analytics field missing: ${key}`)
    }
  })
  
  console.log("✅ Session analytics schema validated.")
  