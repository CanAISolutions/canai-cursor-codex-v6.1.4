// ✅ test-dynamic-placid-template-vars.ts
// Validates that required Placid template vars exist in test payload

const payload = {
    bizName: "CanAI Solutions",
    goal: "Build trust with AI",
    tone: "Professional"
  }
  
  const requiredFields = ["bizName", "goal", "tone"]
  
  requiredFields.forEach(field => {
    if (!(field in payload)) {
      console.error(`❌ Missing Placid template field: ${field}`)
      process.exit(1)
    }
  })
  
  console.log("✅ Placid dynamic input fields present.")
  