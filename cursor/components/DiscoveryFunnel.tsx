/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Discovery Funnel with smart defaults"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose User input collection with personalized pre-fill
 */

import React, { useState, useEffect } from 'react';
import { EventBus } from '../event-bus/eventBus';
import { SmartDefaultsEngine } from '../utils/smartDefaultsEngine';
import { emitSystemLog } from '../utils/audit-utils';
import { SparkOverlay } from './SparkOverlay';

interface UserIntent {
  challenge: string;
  tone: string;
  industry?: string;
  emotionalStyle?: string;
}

interface DiscoveryFunnelProps {
  onSparkGenerated?: (spark: any) => void;
}

const TONE_OPTIONS = [
  { value: 'playful', label: 'Playful & Creative' },
  { value: 'bold', label: 'Bold & Confident' },
  { value: 'calm', label: 'Calm & Professional' },
  { value: 'luxury', label: 'Luxury & Premium' }
];

const INDUSTRY_OPTIONS = [
  { value: 'coffee', label: 'Coffee & Beverages' },
  { value: 'bakery', label: 'Bakery & Food' },
  { value: 'fitness', label: 'Fitness & Wellness' },
  { value: 'consulting', label: 'Consulting & Services' },
  { value: 'saas', label: 'SaaS & Technology' }
];

export const DiscoveryFunnel: React.FC<DiscoveryFunnelProps> = ({ onSparkGenerated }) => {
  const [step, setStep] = useState(1);
  const [userIntent, setUserIntent] = useState<UserIntent>({
    challenge: '',
    tone: '',
    industry: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaults, setDefaults] = useState<SmartDefaults | null>(null);

  const eventBus = EventBus.getInstance();
  const smartDefaults = new SmartDefaultsEngine();

  useEffect(() => {
    eventBus.emit('funnelStarted', {
      timestamp: new Date().toISOString()
    });

    // Load smart defaults
    const loadDefaults = async () => {
      try {
        const context = window.location.pathname;
        const smartDefaults = await smartDefaults.getSmartDefaults(context);
        setDefaults(smartDefaults);

        if (smartDefaults.confidence >= 0.6) {
          setUserIntent(prev => ({
            ...prev,
            tone: smartDefaults.tone,
            industry: smartDefaults.industry || prev.industry,
            challenge: smartDefaults.intent || prev.challenge
          }));
        }
      } catch (err) {
        emitSystemLog('defaults-load-error', {
          error: err.message,
          timestamp: new Date().toISOString()
        });
      }
    };

    loadDefaults();
  }, []);

  const handleChallengeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const challenge = e.target.value;
    setUserIntent(prev => ({ ...prev, challenge }));
    
    if (challenge.length > 10) {
      eventBus.emit('intentCaptured', {
        type: 'challenge',
        value: challenge,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleToneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tone = e.target.value;
    setUserIntent(prev => ({ ...prev, tone }));
    
    eventBus.emit('intentCaptured', {
      type: 'tone',
      value: tone,
      timestamp: new Date().toISOString()
    });

    // Record successful tone selection if it matches defaults
    if (defaults?.tone === tone) {
      eventBus.emit('DEFAULTS_APPLIED', {
        defaults: { tone },
        context: window.location.pathname
      });
    }
  };

  const handleIndustrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const industry = e.target.value;
    setUserIntent(prev => ({ ...prev, industry }));
    
    eventBus.emit('intentCaptured', {
      type: 'industry',
      value: industry,
      timestamp: new Date().toISOString()
    });

    // Record successful industry selection if it matches defaults
    if (defaults?.industry === industry) {
      eventBus.emit('DEFAULTS_APPLIED', {
        defaults: { industry },
        context: window.location.pathname
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      eventBus.emit('sparkRequested', {
        intent: userIntent,
        timestamp: new Date().toISOString()
      });

      // Move to spark generation step
      setStep(2);
    } catch (err) {
      setError('We're having trouble processing your request. Please try again.');
      emitSystemLog('funnel-error', {
        error: err instanceof Error ? err.message : 'Unknown error',
        intent: userIntent
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSparkSelected = (spark: any) => {
    if (onSparkGenerated) {
      onSparkGenerated(spark);
    }
    eventBus.emit('sparkGenerated', {
      spark,
      intent: userIntent,
      timestamp: new Date().toISOString()
    });
  };

  if (step === 2) {
    return (
      <SparkOverlay
        context={userIntent.challenge}
        onSparkSelected={handleSparkSelected}
      />
    );
  }

  return (
    <div className="discovery-funnel">
      <form onSubmit={handleSubmit} className="funnel-form">
        <div className="form-step">
          <h2>What's your challenge?</h2>
          <textarea
            value={userIntent.challenge}
            onChange={handleChallengeChange}
            placeholder="Tell us what you're looking to achieve..."
            required
            minLength={10}
            className="challenge-input"
          />
        </div>

        <div className="form-step">
          <h2>Choose your tone</h2>
          <select
            value={userIntent.tone}
            onChange={handleToneSelect}
            required
            className="tone-select"
          >
            <option value="">Select a tone...</option>
            {TONE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-step">
          <h2>What's your industry?</h2>
          <select
            value={userIntent.industry}
            onChange={handleIndustrySelect}
            className="industry-select"
          >
            <option value="">Select an industry...</option>
            {INDUSTRY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !userIntent.challenge || !userIntent.tone}
          className="submit-button"
        >
          {isProcessing ? 'Crafting Your Ideas...' : 'Get My Spark Ideas'}
        </button>
      </form>
    </div>
  );
}; 