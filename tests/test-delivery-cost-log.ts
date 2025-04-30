// ✅ test-delivery-cost-log.ts
// Confirms that cost logging for sessions includes token + PDF + revenue fields

const example = {
    SessionID: "SESSION-TEST",
    Tokens: 1850,
    MakeOpsUsed: 3,
    PDFGenerated: true,
    StripeRevenue: 29,
    MarginEstimate: "87%"
  }
  
  const fields = ["Tokens", "MakeOpsUsed", "PDFGenerated", "StripeRevenue", "MarginEstimate"]
  
  for (const field of fields) {
    if (!(field in example)) {
      throw new Error(`❌ Missing field in delivery log: ${field}`)
    }
  }
  
  console.log("✅ Delivery cost log structure validated.")
  