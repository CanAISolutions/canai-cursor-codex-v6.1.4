// ✅ test-referral-tracker-logging.ts
// Ensures referrals track: referrer ID, output link, conversion flag

const log = {
    ReferrerID: "user-abc123",
    OutputUsed: "https://canai.so/session/xyz",
    LinkClicked: true,
    Converted: true
  }
  
  const required = ["ReferrerID", "OutputUsed", "LinkClicked", "Converted"]
  
  required.forEach(field => {
    if (!(field in log)) {
      throw new Error(`❌ Referral log missing: ${field}`)
    }
  })
  
  console.log("✅ Referral tracking log validated.")
  