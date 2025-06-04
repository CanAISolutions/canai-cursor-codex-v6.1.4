/**
 * CanAI Webflow Custom Code Snippets v6.1.4
 * Enhanced form behavior, analytics integration, and fallback mechanisms
 * Framework: Emotional Sovereignty + Truth-Verified Integration
 */

// Configuration
const CANAI_CONFIG = {
  version: '6.1.4',
  apiBaseUrl: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://api.canai.so',
  endpoints: {
    orchestrator: '/api/webhook/emotional-sovereignty-bridge',
    fallback: '/api/webhook/fallback-collection',
    health: '/api/health'
  },
  analytics: {
    enabled: true,
    provider: 'mixpanel', // or 'segment', 'ga4'
    trackingId: 'canai-discovery-funnel'
  },
  memberstack: {
    enabled: true,
    fallbackToLocalStorage: true
  },
  performance: {
    timeout: 30000,
    retries: 3,
    fallbackTimeout: 5000
  }
};

// Enhanced Analytics Integration
class CanAIAnalytics {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.startTime = Date.now();
    this.events = [];
  }

  track(event, properties = {}) {
    const eventData = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        version: CANAI_CONFIG.version,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    this.events.push(eventData);

    // Send to analytics provider
    if (CANAI_CONFIG.analytics.enabled) {
      this.sendToProvider(eventData);
    }

    // Log for debugging
    if (window.location.hostname === 'localhost') {
      console.log('CanAI Analytics:', eventData);
    }
  }

  sendToProvider(eventData) {
    // Mixpanel integration
    if (window.mixpanel && CANAI_CONFIG.analytics.provider === 'mixpanel') {
      window.mixpanel.track(eventData.event, eventData.properties);
    }

    // Segment integration
    if (window.analytics && CANAI_CONFIG.analytics.provider === 'segment') {
      window.analytics.track(eventData.event, eventData.properties);
    }

    // Google Analytics 4 integration
    if (window.gtag && CANAI_CONFIG.analytics.provider === 'ga4') {
      window.gtag('event', eventData.event, eventData.properties);
    }
  }

  getOrCreateSessionId() {
    // Try Memberstack first
    if (window.MemberStack && CANAI_CONFIG.memberstack.enabled) {
      try {
        const memberstackSession = window.MemberStack.getSessionId();
        if (memberstackSession) return memberstackSession;
      } catch (error) {
        console.warn('Memberstack session retrieval failed:', error);
      }
    }

    // Fallback to localStorage
    let sessionId = localStorage.getItem('canai-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('canai-session-id', sessionId);
    }
    return sessionId;
  }

  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      duration: Date.now() - this.startTime,
      eventCount: this.events.length,
      events: this.events
    };
  }
}

// Enhanced Form Handler
class CanAIFormHandler {
  constructor() {
    this.analytics = new CanAIAnalytics();
    this.dwellTimeStart = null;
    this.fieldInteractions = 0;
    this.validationErrors = {};
    this.isSubmitting = false;
    
    this.initializeForm();
  }

  initializeForm() {
    // Track form initialization
    this.analytics.track('form_initialized', {
      formType: 'discovery_funnel',
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });

    // Set up form event listeners
    this.setupEventListeners();
    
    // Initialize session tracking
    this.startDwellTimeTracking();
    
    // Check API health
    this.checkAPIHealth();
  }

  setupEventListeners() {
    // Form submission
    const form = document.getElementById('discoveryFunnelForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Field interactions
    const fields = document.querySelectorAll('#discoveryFunnelForm input, #discoveryFunnelForm select, #discoveryFunnelForm textarea');
    fields.forEach(field => {
      field.addEventListener('focus', (e) => this.handleFieldFocus(e));
      field.addEventListener('blur', (e) => this.handleFieldBlur(e));
      field.addEventListener('input', (e) => this.handleFieldInput(e));
    });

    // Modal events
    const modal = document.getElementById('discoveryFunnelModal');
    if (modal) {
      // Track modal open/close
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'style') {
            const isVisible = modal.style.display !== 'none';
            if (isVisible && !this.dwellTimeStart) {
              this.startDwellTimeTracking();
              this.analytics.track('funnel_opened');
            } else if (!isVisible && this.dwellTimeStart) {
              this.analytics.track('funnel_closed', {
                dwellTime: this.getDwellTime(),
                fieldInteractions: this.fieldInteractions
              });
            }
          }
        });
      });
      observer.observe(modal, { attributes: true });
    }
  }

  startDwellTimeTracking() {
    this.dwellTimeStart = Date.now();
  }

  getDwellTime() {
    return this.dwellTimeStart ? Math.floor((Date.now() - this.dwellTimeStart) / 1000) : 0;
  }

  handleFieldFocus(event) {
    this.analytics.track('field_focused', {
      fieldName: event.target.name,
      fieldType: event.target.type,
      dwellTime: this.getDwellTime()
    });
  }

  handleFieldBlur(event) {
    const field = event.target;
    const isValid = this.validateField(field);
    
    this.analytics.track('field_blurred', {
      fieldName: field.name,
      fieldType: field.type,
      hasValue: !!field.value,
      isValid,
      dwellTime: this.getDwellTime()
    });
  }

  handleFieldInput(event) {
    this.fieldInteractions++;
    
    // Clear previous validation errors
    this.clearFieldError(event.target.name);
    
    // Track meaningful input
    if (event.target.name === 'intent' && event.target.value.length > 10) {
      this.analytics.track('intent_captured', {
        intentLength: event.target.value.length,
        dwellTime: this.getDwellTime(),
        fieldInteractions: this.fieldInteractions
      });
    }
  }

  validateField(field) {
    const rules = this.getValidationRules()[field.name];
    if (!rules) return true;

    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (rules.required && !field.value.trim()) {
      isValid = false;
      errorMessage = rules.errorMessage || `${field.name} is required`;
    }

    // Length validation
    if (isValid && rules.minLength && field.value.length < rules.minLength) {
      isValid = false;
      errorMessage = `Minimum ${rules.minLength} characters required`;
    }

    if (isValid && rules.maxLength && field.value.length > rules.maxLength) {
      isValid = false;
      errorMessage = `Maximum ${rules.maxLength} characters allowed`;
    }

    // Enum validation
    if (isValid && rules.enum && !rules.enum.includes(field.value)) {
      isValid = false;
      errorMessage = rules.errorMessage || 'Invalid selection';
    }

    // Pattern validation
    if (isValid && rules.pattern && !rules.pattern.test(field.value)) {
      isValid = false;
      errorMessage = rules.errorMessage || 'Invalid format';
    }

    // Display error if invalid
    if (!isValid) {
      this.displayFieldError(field.name, errorMessage);
      this.validationErrors[field.name] = errorMessage;
    } else {
      delete this.validationErrors[field.name];
    }

    return isValid;
  }

  getValidationRules() {
    return {
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
      }
    };
  }

  displayFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    const feedback = field.parentElement.querySelector('.field-feedback');
    if (feedback) {
      field.classList.add('invalid');
      feedback.textContent = message;
      feedback.style.display = 'block';
    }
  }

  clearFieldError(fieldName) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    const feedback = field.parentElement.querySelector('.field-feedback');
    if (feedback) {
      field.classList.remove('invalid');
      feedback.style.display = 'none';
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    try {
      // Validate form
      const formData = this.getFormData();
      const validationErrors = this.validateForm(formData);
      
      if (validationErrors.length > 0) {
        this.analytics.track('form_validation_failed', {
          errors: validationErrors,
          dwellTime: this.getDwellTime(),
          fieldInteractions: this.fieldInteractions
        });
        this.isSubmitting = false;
        return;
      }

      // Show loading state
      this.setLoadingState(true);

      // Track submission attempt
      this.analytics.track('form_submitted', {
        formData: this.sanitizeFormDataForAnalytics(formData),
        dwellTime: this.getDwellTime(),
        fieldInteractions: this.fieldInteractions
      });

      // Submit to orchestrator
      const result = await this.submitToOrchestrator(formData);
      
      if (result.success) {
        this.handleSubmissionSuccess(result);
      } else {
        throw new Error(result.error || 'Submission failed');
      }

    } catch (error) {
      this.handleSubmissionError(error);
    } finally {
      this.setLoadingState(false);
      this.isSubmitting = false;
    }
  }

  getFormData() {
    const form = document.getElementById('discoveryFunnelForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Add tracking data
    data.sessionId = this.analytics.sessionId;
    data.dwellTime = this.getDwellTime().toString();
    data.fieldInteractions = this.fieldInteractions.toString();
    data.timestamp = new Date().toISOString();
    data.preferredTone = this.getPreferredTone();
    
    return data;
  }

  getPreferredTone() {
    // Try Memberstack first
    if (window.MemberStack && CANAI_CONFIG.memberstack.enabled) {
      try {
        return window.MemberStack.getUserField('preferredTone') || '';
      } catch (error) {
        console.warn('Memberstack preferred tone retrieval failed:', error);
      }
    }
    
    // Fallback to localStorage
    return localStorage.getItem('canai-preferred-tone') || '';
  }

  validateForm(formData) {
    const errors = [];
    const rules = this.getValidationRules();
    
    Object.keys(rules).forEach(fieldName => {
      const rule = rules[fieldName];
      const value = formData[fieldName];
      
      if (rule.required && (!value || !value.trim())) {
        errors.push({ field: fieldName, message: rule.errorMessage });
      }
      
      if (value && rule.minLength && value.length < rule.minLength) {
        errors.push({ field: fieldName, message: `Minimum ${rule.minLength} characters required` });
      }
      
      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors.push({ field: fieldName, message: `Maximum ${rule.maxLength} characters allowed` });
      }
      
      if (value && rule.enum && !rule.enum.includes(value)) {
        errors.push({ field: fieldName, message: rule.errorMessage });
      }
    });
    
    // Display errors
    errors.forEach(error => {
      this.displayFieldError(error.field, error.message);
    });
    
    return errors;
  }

  async submitToOrchestrator(formData) {
    const payload = {
      userInput: {
        intent: formData.intent,
        tone: formData.tone,
        industry: formData.industry,
        pain_point: formData.pain_point
      },
      sessionId: formData.sessionId,
      productType: 'discovery_funnel',
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
      verificationStatus: 'TRUTH-VERIFIED-WEBFLOW-INTEGRATION'
    };

    const response = await fetch(`${CANAI_CONFIG.apiBaseUrl}${CANAI_CONFIG.endpoints.orchestrator}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      timeout: CANAI_CONFIG.performance.timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  async checkAPIHealth() {
    try {
      const response = await fetch(`${CANAI_CONFIG.apiBaseUrl}${CANAI_CONFIG.endpoints.health}`, {
        method: 'GET',
        timeout: 5000
      });
      
      const isHealthy = response.ok;
      this.analytics.track('api_health_check', {
        isHealthy,
        responseTime: Date.now() - this.analytics.startTime
      });
      
      return isHealthy;
    } catch (error) {
      this.analytics.track('api_health_check_failed', {
        error: error.message
      });
      return false;
    }
  }

  handleSubmissionSuccess(result) {
    this.analytics.track('form_submission_success', {
      sessionId: result.sessionId,
      trustScore: result.emotionalArc?.finalTrustScore,
      sparkResonance: result.sparkResonance?.overallResonance,
      emotionalArcType: result.emotionalArc?.emotionalArcType,
      processingTime: Date.now() - this.analytics.startTime
    });

    // Show success message
    this.showSuccessMessage();
    
    // Store result for potential follow-up
    localStorage.setItem('canai-last-result', JSON.stringify(result));
  }

  handleSubmissionError(error) {
    this.analytics.track('form_submission_error', {
      error: error.message,
      dwellTime: this.getDwellTime(),
      fieldInteractions: this.fieldInteractions
    });

    // Show error message
    this.showErrorMessage(error.message);
    
    // Try fallback if available
    this.tryFallbackSubmission();
  }

  async tryFallbackSubmission() {
    try {
      const formData = this.getFormData();
      const fallbackPayload = {
        ...formData,
        fallback: true,
        originalError: 'Primary submission failed',
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${CANAI_CONFIG.apiBaseUrl}${CANAI_CONFIG.endpoints.fallback}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fallbackPayload),
        timeout: CANAI_CONFIG.performance.fallbackTimeout
      });

      if (response.ok) {
        this.analytics.track('fallback_submission_success');
        this.showSuccessMessage('Your request has been received and will be processed shortly.');
      }
    } catch (fallbackError) {
      this.analytics.track('fallback_submission_failed', {
        error: fallbackError.message
      });
    }
  }

  setLoadingState(isLoading) {
    const submitButton = document.querySelector('#discoveryFunnelForm .submit-button');
    const buttonText = submitButton?.querySelector('.button-text');
    const loadingSpinner = submitButton?.querySelector('.loading-spinner');

    if (submitButton) {
      submitButton.disabled = isLoading;
      
      if (buttonText) {
        buttonText.style.display = isLoading ? 'none' : 'block';
      }
      
      if (loadingSpinner) {
        loadingSpinner.style.display = isLoading ? 'block' : 'none';
      }
    }
  }

  showSuccessMessage(customMessage) {
    const form = document.getElementById('discoveryFunnelForm');
    const successMessage = document.getElementById('successMessage');
    
    if (form && successMessage) {
      form.style.display = 'none';
      successMessage.style.display = 'block';
      
      if (customMessage) {
        const messageText = successMessage.querySelector('p');
        if (messageText) {
          messageText.textContent = customMessage;
        }
      }
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        this.closeModal();
      }, 3000);
    }
  }

  showErrorMessage(errorMessage) {
    const errorMessageEl = document.getElementById('errorMessage');
    
    if (errorMessageEl) {
      const messageText = errorMessageEl.querySelector('p');
      if (messageText) {
        messageText.textContent = errorMessage || 'Something went wrong. Please try again.';
      }
      
      errorMessageEl.style.display = 'block';
      
      // Hide after 5 seconds
      setTimeout(() => {
        errorMessageEl.style.display = 'none';
      }, 5000);
    }
  }

  closeModal() {
    const modal = document.getElementById('discoveryFunnelModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  sanitizeFormDataForAnalytics(formData) {
    return {
      intentLength: formData.intent?.length || 0,
      tone: formData.tone,
      industry: formData.industry,
      hasPainPoint: !!formData.pain_point,
      dwellTime: formData.dwellTime,
      fieldInteractions: formData.fieldInteractions
    };
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.canaiFormHandler = new CanAIFormHandler();
  
  // Global functions for backward compatibility
  window.openDiscoveryFunnel = () => {
    const modal = document.getElementById('discoveryFunnelModal');
    if (modal) {
      modal.style.display = 'flex';
    }
  };
  
  window.closeDiscoveryFunnel = () => {
    window.canaiFormHandler.closeModal();
  };
  
  window.handleFunnelSubmit = (event) => {
    window.canaiFormHandler.handleSubmit(event);
  };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CanAIFormHandler, CanAIAnalytics };
}
