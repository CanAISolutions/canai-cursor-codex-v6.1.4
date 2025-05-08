// Make.com Webhook Handler
// This script processes incoming webhook requests from the Discovery Funnel
// and routes them to Airtable for storage and analytics

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = 'SessionAnalytics';

// Process incoming webhook request
async function handleWebhook(req, res) {
  try {
    // Validate request
    if (!req.body || !req.body.intent) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Extract form data
    const {
      intent,
      tone,
      industry,
      pain_point,
      sessionId,
      preferredTone,
      timestamp
    } = req.body;

    // Calculate emotional resonance score
    const emotionalResonance = calculateEmotionalResonance({
      intent,
      tone,
      industry,
      pain_point
    });

    // Calculate trust score
    const trustScore = calculateTrustScore({
      emotionalResonance,
      preferredTone,
      tone
    });

    // Prepare Airtable record
    const record = {
      fields: {
        SessionID: sessionId,
        Intent: intent,
        Industry: industry,
        Tone: tone,
        PainPoint: pain_point || '',
        PreferredTone: preferredTone || '',
        Timestamp: timestamp,
        EmotionalResonance: emotionalResonance,
        TrustScore: trustScore,
        Status: 'pending',
        ProcessedAt: new Date().toISOString()
      }
    };

    // Store in Airtable
    await storeInAirtable(record);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Form submission processed successfully',
      data: {
        sessionId,
        emotionalResonance,
        trustScore
      }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Calculate emotional resonance score
function calculateEmotionalResonance(data) {
  let score = 0;
  
  // Intent length and complexity
  if (data.intent.length > 50) score += 0.3;
  if (data.intent.length > 100) score += 0.2;
  
  // Pain point presence
  if (data.pain_point) score += 0.2;
  
  // Industry specificity
  if (data.industry) score += 0.2;
  
  // Tone alignment
  if (data.tone) score += 0.1;
  
  return Math.min(score, 1.0);
}

// Calculate trust score
function calculateTrustScore(data) {
  let score = data.emotionalResonance;
  
  // Tone alignment bonus
  if (data.preferredTone && data.preferredTone === data.tone) {
    score += 0.2;
  }
  
  return Math.min(score, 1.0);
}

// Store record in Airtable
async function storeInAirtable(record) {
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(record)
    }
  );

  if (!response.ok) {
    throw new Error('Failed to store record in Airtable');
  }

  return response.json();
}

// Export handler
module.exports = handleWebhook; 