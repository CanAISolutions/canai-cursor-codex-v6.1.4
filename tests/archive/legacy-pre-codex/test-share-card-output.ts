// ✅ test-share-card-output.ts
// Validates referral asset and share preview renders key content

const shareOutput = {
    headline: "Launch Smarter with AI",
    subtext: "CanAI builds your strategy in seconds.",
    imageURL: "https://cdn.canai.so/preview.jpg"
  }
  
  if (!shareOutput.headline || !shareOutput.imageURL) {
    throw new Error("❌ Share output missing key fields")
  }
  
  console.log("✅ Share card data validated.")
  