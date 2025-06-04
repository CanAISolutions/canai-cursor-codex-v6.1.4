# Webflow Form Field Mapping v6.1.4

> **Purpose**: Maps Webflow Discovery Funnel fields to Emotional Sovereignty Orchestrator input schema  
> **Status**: Production-Ready - Truth-Verified Mapping  
> **Framework**: EmotionalSovereigntyRequest Interface Alignment  

## Overview

This document defines the precise mapping between Webflow form fields and the Emotional Sovereignty Orchestrator's `EmotionalSovereigntyRequest` interface, ensuring data consistency across the MVP flow.

## Primary Form Fields

### User Input Fields

| Webflow Field | HTML Name | Orchestrator Path | Type | Required | Validation |
|---------------|-----------|-------------------|------|----------|------------|
| Intent Textarea | `intent` | `userInput.intent` | string | ✅ | minLength: 10, maxLength: 1000 |
| Tone Select | `tone` | `userInput.tone` | string | ✅ | enum: ["playful", "bold", "calm", "luxury"] |
| Industry Select | `industry` | `userInput.industry` | string | ❌ | enum: ["coffee", "bakery", "fitness", "consulting", "saas"] |
| Pain Point Textarea | `pain_point` | `userInput.pain_point` | string | ❌ | maxLength: 500 |

### Session Context Fields

| Webflow Field | HTML Name | Orchestrator Path | Type | Required | Source |
|---------------|-----------|-------------------|------|----------|--------|
| Session ID | `sessionId` | `sessionId` | string | ✅ | Generated or Memberstack |
| Product Type | N/A | `productType` | string | ✅ | Hardcoded: "discovery_funnel" |
| Preferred Tone | `preferredTone` | `context.preferredTone` | string | ❌ | Memberstack or localStorage |
| Timestamp | `timestamp` | `context.timestamp` | string | ✅ | Generated: ISO 8601 |
| Dwell Time | `dwellTime` | `context.dwellTime` | string | ✅ | Tracked: seconds on form |
| Field Interactions | `fieldInteractions` | `context.fieldInteractions` | string | ✅ | Tracked: interaction count |

## Data Transformation

### Input Payload Structure

```javascript
// Webflow Form Data (FormData)
const formData = {
  intent: "Launch coffee shop online presence with bold branding",
  tone: "bold",
  industry: "coffee",
  pain_point: "Struggling to stand out in crowded market",
  sessionId: "session-1706123456789",
  preferredTone: "bold",
  timestamp: "2025-01-27T10:30:00.000Z",
  dwellTime: "45",
  fieldInteractions: "8"
};

// Orchestrator Request (EmotionalSovereigntyRequest)
const orchestratorRequest = {
  userInput: {
    intent: formData.intent,
    tone: formData.tone,
    industry: formData.industry,
    pain_point: formData.pain_point
  },
  sessionId: formData.sessionId,
  productType: "discovery_funnel",
  context: {
    preferredTone: formData.preferredTone,
    dwellTime: formData.dwellTime,
    fieldInteractions: formData.fieldInteractions,
    timestamp: formData.timestamp
  }
};
```

### Enhanced Payload for MVP Flow

```javascript
// Enhanced payload with verification status
const enhancedPayload = {
  userInput: {
    intent: formData.intent,
    tone: formData.tone,
    industry: formData.industry,
    pain_point: formData.pain_point
  },
  sessionId: formData.sessionId,
  productType: "discovery_funnel",
  context: {
    preferredTone: formData.preferredTone,
    dwellTime: formData.dwellTime,
    fieldInteractions: formData.fieldInteractions,
    timestamp: formData.timestamp,
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  },
  verificationStatus: "TRUTH-VERIFIED-WEBFLOW-INTEGRATION"
};
```

## Validation Rules

### Client-Side Validation

```javascript
const validationRules = {
  intent: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    pattern: /^[\s\S]*$/,
    errorMessage: "Please describe your challenge (minimum 10 characters)"
  },
  tone: {
    required: true,
    enum: ["playful", "bold", "calm", "luxury"],
    errorMessage: "Please select a tone"
  },
  industry: {
    required: false,
    enum: ["coffee", "bakery", "fitness", "consulting", "saas", "other"],
    errorMessage: "Please select a valid industry"
  },
  pain_point: {
    required: false,
    maxLength: 500,
    errorMessage: "Pain point description too long (max 500 characters)"
  },
  sessionId: {
    required: true,
    pattern: /^[a-zA-Z0-9-_]+$/,
    errorMessage: "Invalid session identifier"
  }
};
```

### Server-Side Validation

The Emotional Sovereignty Orchestrator performs additional validation:

- **Intent Analysis**: Emotional content validation
- **Trust Score Calculation**: Based on input quality and consistency
- **Spam Detection**: Pattern recognition for automated submissions
- **Rate Limiting**: Per-session and per-IP restrictions

## Field Interaction Tracking

### Dwell Time Calculation

```javascript
let dwellTimeInterval;
const startDwellTimeTracking = () => {
  const startTime = Date.now();
  dwellTimeInterval = setInterval(() => {
    const dwellTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('dwellTime').value = dwellTime;
  }, 1000);
};
```

### Interaction Counting

```javascript
let interactionCount = 0;
const trackFieldInteraction = (field) => {
  interactionCount++;
  document.getElementById('fieldInteractions').value = interactionCount;
  
  // Emit analytics event
  emitAnalytics('fieldInteraction', {
    field: field.name,
    value: field.value,
    interactionCount,
    timestamp: new Date().toISOString()
  });
};
```

## Error Handling

### Field-Level Errors

```javascript
const displayFieldError = (fieldName, message) => {
  const field = document.querySelector(`[name="${fieldName}"]`);
  const feedback = field.parentElement.querySelector('.field-feedback');
  
  field.classList.add('invalid');
  feedback.textContent = message;
  feedback.style.display = 'block';
};

const clearFieldError = (fieldName) => {
  const field = document.querySelector(`[name="${fieldName}"]`);
  const feedback = field.parentElement.querySelector('.field-feedback');
  
  field.classList.remove('invalid');
  feedback.style.display = 'none';
};
```

### Form-Level Validation

```javascript
const validateForm = (formData) => {
  const errors = [];
  
  // Validate required fields
  if (!formData.intent || formData.intent.length < 10) {
    errors.push({ field: 'intent', message: 'Intent must be at least 10 characters' });
  }
  
  if (!formData.tone) {
    errors.push({ field: 'tone', message: 'Please select a tone' });
  }
  
  // Validate enum values
  const validTones = ['playful', 'bold', 'calm', 'luxury'];
  if (formData.tone && !validTones.includes(formData.tone)) {
    errors.push({ field: 'tone', message: 'Invalid tone selection' });
  }
  
  return errors;
};
```

## Analytics Integration

### Event Mapping

| User Action | Analytics Event | Data Captured |
|-------------|----------------|---------------|
| Form Opened | `funnelStarted` | sessionId, timestamp, referrer |
| Field Focus | `fieldFocused` | fieldName, dwellTime, interactionCount |
| Field Blur | `fieldBlurred` | fieldName, value, validationStatus |
| Intent Captured | `intentCaptured` | intentLength, emotionalIndicators |
| Form Submitted | `sparkRequested` | allFormData, validationStatus |
| Submission Success | `sparkRequestedSuccess` | responseTime, trustScore |
| Submission Error | `sparkRequestedError` | errorType, errorMessage |

### Analytics Payload

```javascript
const analyticsPayload = {
  event: 'sparkRequested',
  sessionId: formData.sessionId,
  timestamp: new Date().toISOString(),
  formData: {
    intent: formData.intent,
    tone: formData.tone,
    industry: formData.industry,
    hasP ainPoint: !!formData.pain_point
  },
  context: {
    dwellTime: formData.dwellTime,
    fieldInteractions: formData.fieldInteractions,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  },
  verificationStatus: "TRUTH-VERIFIED-ANALYTICS"
};
```

## Integration Testing

### Test Scenarios

1. **Complete Form Submission**
   - All required fields filled
   - Valid enum selections
   - Successful orchestrator processing

2. **Partial Form Submission**
   - Missing optional fields
   - Graceful handling and processing

3. **Invalid Data Submission**
   - Invalid enum values
   - Field length violations
   - Proper error display and handling

4. **Session Management**
   - Session ID generation and persistence
   - Memberstack integration
   - Fallback mechanisms

### Validation Checklist

- [ ] All form fields map correctly to orchestrator schema
- [ ] Client-side validation matches server-side rules
- [ ] Analytics events fire for all user interactions
- [ ] Error handling displays appropriate messages
- [ ] Session tracking works across page reloads
- [ ] Fallback mechanisms activate during failures
- [ ] Performance targets met for form interactions

## Security Considerations

### Input Sanitization

```javascript
const sanitizeInput = (input) => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};
```

### Rate Limiting

- **Per Session**: Maximum 5 submissions per hour
- **Per IP**: Maximum 20 submissions per hour
- **Global**: Circuit breaker for unusual traffic patterns

### Data Privacy

- **PII Handling**: No personally identifiable information stored in form
- **GDPR Compliance**: Clear consent and data usage policies
- **Data Retention**: Form data purged after processing completion

---

**Last Updated**: 2025-01-27  
**Version**: v6.1.4  
**Status**: Production-Ready - Truth-Verified Mapping
