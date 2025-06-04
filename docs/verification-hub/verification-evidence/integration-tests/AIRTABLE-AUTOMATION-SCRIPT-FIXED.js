// Airtable automation script to send webhook - CORRECTED VERSION
let config = input.config();

// Get the record data
let record = config.record;

// Prepare webhook payload
let webhookPayload = {
  userInput: {
    intent: record.getCellValue("Intent"),
    tone: record.getCellValue("Tone"),
    industry: record.getCellValue("Industry"),
    pain_point: record.getCellValue("PainPoint")
  },
  sessionId: record.getCellValue("SessionID") || `airtable-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  productType: 'discovery_funnel',
  context: {
    preferredTone: record.getCellValue("Tone"),
    timestamp: new Date().toISOString(),
    source: 'airtable_form',
    dwellTime: '0',
    fieldInteractions: '4'
  },
  verificationStatus: 'AIRTABLE-FORM-MVP-TEST'
};

// Send webhook
let response = await fetch('https://your-domain.com/api/webhook/emotional-sovereignty-bridge', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(webhookPayload)
});

// Log the response
console.log('Webhook sent:', response.status);
console.log('Response:', await response.text());

// Return success indicator
output.set('webhookSent', true);
output.set('responseStatus', response.status);
output.set('sessionId', webhookPayload.sessionId); 