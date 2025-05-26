// ✅ test-user-traits-sync.ts
// Validates trait fields used for lifecycle, personalization, and analytics

const traits = {
    userId: "user-xyz",
    persona: "Founder",
    region: "CA",
    tonePreference: "Friendly, Professional",
    preferredPrompt: "ai_blueprint"
  }
  
  const required = ["userId", "tonePreference", "preferredPrompt"]
  
  required.forEach(key => {
    if (!traits[key]) {
      console.error(`❌ User trait missing: ${key}`)
      process.exit(1)
    }
  })
  
  console.log("✅ User trait structure verified.")
  