/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Enhanced Discovery Funnel with emotional sovereignty integration"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Connects user input to emotional sovereignty system with real-time feedback
 */

import React, { useState, useEffect } from 'react';
import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from '../utils/audit-utils';
import { SparkOverlay } from './SparkOverlay';

interface UserIntent {
  challenge: string;
  tone: string;
  industry?: string;
  emotionalStyle?: string;
  painPoint?: string;
}

interface EmotionalSovereigntyResponse {
  success: boolean;
  sessionId: string;
  structuredIntent: any;
  emotionalContext: any;
  sparkResonance: any;
  confirmationMeta: any;
  emotionalArc: any;
  readyForExecution: boolean;
  makeWebhookData: any;
  timestamp: string;
}

interface EnhancedDiscoveryFunnelProps {
  onEmotionalSovereigntyComplete?: (response: EmotionalSovereigntyResponse) => void;
  productType: string;
  context?: string;
}

const TONE_OPTIONS = [
  { value: 'playful', label: 'Playful & Creative', emoji: '🎨' },
  { value: 'bold', label: 'Bold & Confident', emoji: '💪' },
  { value: 'calm', label: 'Calm & Professional', emoji: '🧘' },
  { value: 'luxury', label: 'Luxury & Premium', emoji: '✨' },
  { value: 'supportive', label: 'Supportive & Caring', emoji: '🤗' },
  { value: 'strategic', label: 'Strategic & Focused', emoji: '🎯' }
];

const INDUSTRY_OPTIONS = [
  { value: 'coffee', label: 'Coffee & Beverages', emoji: '☕' },
  { value: 'bakery', label: 'Bakery & Food', emoji: '🥐' },
  { value: 'fitness', label: 'Fitness & Wellness', emoji: '💪' },
  { value: 'consulting', label: 'Consulting & Services', emoji: '💼' },
  { value: 'saas', label: 'SaaS & Technology', emoji: '💻' },
  { value: 'creative', label: 'Creative & Design', emoji: '🎨' }
];

export const EnhancedDiscoveryFunnel: React.FC<EnhancedDiscoveryFunnelProps> = ({ 
  onEmotionalSovereigntyComplete, 
  productType,
  context 
}) => {
  const [step, setStep] = useState(1);
  const [userIntent, setUserIntent] = useState<UserIntent>({
    challenge: '',
    tone: '',
    industry: '',
    emotionalStyle: '',
    painPoint: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [emotionalFeedback, setEmotionalFeedback] = useState<string>('');
  const [trustScore, setTrustScore] = useState<number>(4.0);

  const eventBus = EventBus.getInstance();

  useEffect(() => {
    eventBus.emit('enhanced-funnel-started', {
      sessionId,
      productType,
      timestamp: new Date().toISOString()
    });

    // Load smart defaults (placeholder)
    loadSmartDefaults();
  }, [sessionId, productType]);

  const loadSmartDefaults = async () => {
    try {
      // This would integrate with SmartDefaultsEngine
      // For now, we'll use placeholder logic
      const contextDefaults = getContextDefaults(context || productType);
      if (contextDefaults) {
        setUserIntent(prev => ({
          ...prev,
          ...contextDefaults
        }));
        setEmotionalFeedback('We've pre-filled some details based on your context');
      }
    } catch (err) {
      emitSystemLog('smart-defaults-error', {
        error: err instanceof Error ? err.message : 'Unknown error',
        sessionId,
        timestamp: new Date().toISOString()
      });
    }
  };

  const getContextDefaults = (context: string) => {
    const defaults: Record<string, Partial<UserIntent>> = {
      'business_plan': { tone: 'strategic', emotionalStyle: 'confident' },
      'email_campaign': { tone: 'supportive', emotionalStyle: 'caring' },
      'social_content': { tone: 'playful', emotionalStyle: 'engaging' },
      'site_audit': { tone: 'professional', emotionalStyle: 'analytical' }
    };
    return defaults[context] || null;
  };

  const handleInputChange = (field: keyof UserIntent, value: string) => {
    setUserIntent(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time emotional feedback
    updateEmotionalFeedback(field, value);
  };

  const updateEmotionalFeedback = (field: keyof UserIntent, value: string) => {
    const feedbackMap: Record<string, Record<string, string>> = {
      tone: {
        'bold': 'Great choice! Bold energy will make your message stand out.',
        'calm': 'Perfect for building trust and professional credibility.',
        'playful': 'Excellent for connecting with your audience emotionally.',
        'luxury': 'Sophisticated choice that conveys premium value.',
        'supportive': 'Wonderful for building lasting relationships.',
        'strategic': 'Smart approach for clear, focused communication.'
      },
      challenge: {
        'launch': `Exciting! We'll help you create momentum for your launch.`,
        'grow': 'Growth-focused strategies coming your way.',
        'brand': `Brand building is powerful - let's make you memorable.`,
        'content': `Content that converts - we've got you covered.`
      }
    };

    const feedback = feedbackMap[field]?.[value.toLowerCase()];
    if (feedback) {
      setEmotionalFeedback(feedback);
      setTrustScore(prev => Math.min(prev + 0.1, 5.0));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      emitSystemLog('emotional-sovereignty-request', {
        sessionId,
        userIntent,
        productType,
        timestamp: new Date().toISOString()
      });

      // Call emotional sovereignty API
      const response = await fetch('/api/webhook/emotional-sovereignty-bridge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userInput: userIntent,
          sessionId,
          productType,
          context
        })
      });

      const result: EmotionalSovereigntyResponse = await response.json();

      if (result.success) {
        emitSystemLog('emotional-sovereignty-success', {
          sessionId,
          emotionalTrustScore: result.emotionalArc.finalTrustScore,
          sparkResonance: result.sparkResonance.overallResonance,
          timestamp: new Date().toISOString()
        });

        if (onEmotionalSovereigntyComplete) {
          onEmotionalSovereigntyComplete(result);
        }

        // Move to results step
        setStep(3);
      } else {
        throw new Error(result.error || 'Processing failed');
      }

    } catch (err) {
      setError(`We're having trouble processing your request. Please try again.`);
      emitSystemLog('enhanced-funnel-error', {
        error: err instanceof Error ? err.message : 'Unknown error',
        sessionId,
        userIntent
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep1 = () => (
    <div className="enhanced-discovery-step">
      <h2>Tell us about your vision</h2>
      <p className="emotional-feedback">{emotionalFeedback}</p>
      
      <form onSubmit={handleSubmit} className="discovery-form">
        <div className="form-group">
          <label htmlFor="challenge">What's your main challenge or goal?</label>
          <textarea
            id="challenge"
            value={userIntent.challenge}
            onChange={(e) => handleInputChange('challenge', e.target.value)}
            placeholder="Describe what you're trying to achieve..."
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tone">What tone feels right for your brand?</label>
          <div className="tone-options">
            {TONE_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                className={`tone-option ${userIntent.tone === option.value ? 'selected' : ''}`}
                onClick={() => handleInputChange('tone', option.value)}
              >
                <span className="emoji">{option.emoji}</span>
                <span className="label">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="industry">What industry are you in?</label>
          <select
            id="industry"
            value={userIntent.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
          >
            <option value="">Select your industry...</option>
            {INDUSTRY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="painPoint">What's your biggest pain point right now?</label>
          <input
            id="painPoint"
            type="text"
            value={userIntent.painPoint}
            onChange={(e) => handleInputChange('painPoint', e.target.value)}
            placeholder="What's keeping you up at night?"
          />
        </div>

        <div className="trust-indicator">
          <div className="trust-score">
            Trust Score: {trustScore.toFixed(1)}/5.0
            <div className="trust-bar">
              <div 
                className="trust-fill" 
                style={{ width: `${(trustScore / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={!userIntent.challenge || !userIntent.tone || isProcessing}
        >
          {isProcessing ? 'Processing your vision...' : 'Create my strategy ✨'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="enhanced-discovery-results">
      <h2>Your emotional sovereignty journey is complete! 🎉</h2>
      <p>We've processed your vision with emotional intelligence and created something truly personalized for you.</p>
      
      <div className="results-summary">
        <div className="metric">
          <span className="label">Trust Score:</span>
          <span className="value">{trustScore.toFixed(1)}/5.0</span>
        </div>
        <div className="metric">
          <span className="label">Session ID:</span>
          <span className="value">{sessionId}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="enhanced-discovery-funnel">
      {step === 1 && renderStep1()}
      {step === 2 && (
        <SparkOverlay
          context={userIntent.challenge}
          onSparkSelected={(spark) => {
            emitSystemLog('spark-selected', { spark, sessionId });
            setStep(3);
          }}
        />
      )}
      {step === 3 && renderStep3()}
    </div>
  );
}; 