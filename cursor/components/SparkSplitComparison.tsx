/**
 * SparkSplit Comparison Component (v7.2.0)
 * Purpose: Transparent, non-coercive comparison UI for trust building
 * Features: Side-by-side comparison, emotional compass, user selection, feedback
 */

import React, { useState, useEffect } from 'react';
import { SparkSplitOutput, SparkSplitSessionData } from '../services/spark-split-engine';

interface SparkSplitComparisonProps {
  sparkSplitData: SparkSplitOutput;
  onUserSelection: (
    selection: 'sterile' | 'canai' | 'both' | 'neither' | 'skip',
    feedback?: {
      testimonialContent?: string;
      allowedForUse?: boolean;
      emotionType?: string;
      emotionalSatisfactionScore?: number;
      wouldRefer?: boolean;
      finalFeedbackText?: string;
      userRecoveryApproval?: boolean;
    }
  ) => Promise<void>;
  isFirstTime?: boolean;
  showSequential?: boolean;
  reducedMotion?: boolean;
}

export const SparkSplitComparison: React.FC<SparkSplitComparisonProps> = ({
  sparkSplitData,
  onUserSelection,
  isFirstTime = false,
  showSequential = false,
  reducedMotion = false
}) => {
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [currentView, setCurrentView] = useState<'sterile' | 'canai' | 'both'>('both');
  const [feedback, setFeedback] = useState({
    testimonialContent: '',
    allowedForUse: false,
    emotionType: '',
    emotionalSatisfactionScore: 5,
    wouldRefer: false,
    finalFeedbackText: '',
    userRecoveryApproval: false
  });

  // Handle sequential view for first-time users
  useEffect(() => {
    if (showSequential && isFirstTime) {
      setCurrentView('sterile');
      const timer = setTimeout(() => {
        setCurrentView('canai');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSequential, isFirstTime]);

  const handleSelection = async (selection: 'sterile' | 'canai' | 'both' | 'neither' | 'skip') => {
    setSelectedOutput(selection);

    if (selection === 'canai') {
      setShowTestimonialForm(true);
    } else if (selection === 'sterile') {
      setShowFeedbackForm(true);
    } else {
      // For both, neither, or skip - collect optional feedback
      await onUserSelection(selection, {
        finalFeedbackText: feedback.finalFeedbackText || undefined
      });
    }
  };

  const handleTestimonialSubmit = async () => {
    await onUserSelection('canai', {
      testimonialContent: feedback.testimonialContent || undefined,
      allowedForUse: feedback.allowedForUse,
      emotionType: feedback.emotionType || undefined,
      emotionalSatisfactionScore: feedback.emotionalSatisfactionScore,
      wouldRefer: feedback.wouldRefer
    });
    setShowTestimonialForm(false);
  };

  const handleFeedbackSubmit = async () => {
    await onUserSelection('sterile', {
      finalFeedbackText: feedback.finalFeedbackText,
      userRecoveryApproval: feedback.userRecoveryApproval
    });
    setShowFeedbackForm(false);
  };

  const getOutputCardStyle = (outputType: 'sterile' | 'canai') => {
    const baseStyle = {
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '16px',
      transition: reducedMotion ? 'none' : 'all 0.3s ease',
      cursor: 'pointer',
      border: '2px solid transparent',
      position: 'relative' as const
    };

    if (outputType === 'sterile') {
      return {
        ...baseStyle,
        backgroundColor: '#ffffff',
        boxShadow: 'none',
        border: selectedOutput === 'sterile' ? '2px solid #2196F3' : '2px solid #e0e0e0'
      };
    } else {
      return {
        ...baseStyle,
        background: sparkSplitData.emotionalCompass.colorGradient,
        boxShadow: selectedOutput === 'canai' ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
        border: selectedOutput === 'canai' ? '2px solid #2196F3' : '2px solid transparent',
        transform: !reducedMotion && selectedOutput === 'canai' ? 'scale(1.01)' : 'scale(1)'
      };
    }
  };

  const EmotionalCompass = () => (
    <div 
      className="emotional-compass"
      style={{
        marginTop: '16px',
        padding: '16px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '8px',
        border: '1px solid rgba(0,0,0,0.1)'
      }}
      aria-label={sparkSplitData.emotionalCompass.accessibleLabel}
    >
      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: '#666' }}>
        How this output aims to connect with you emotionally…
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {Object.entries({
          Awe: sparkSplitData.emotionalCompass.awe,
          Ownership: sparkSplitData.emotionalCompass.ownership,
          Wonder: sparkSplitData.emotionalCompass.wonder,
          Calm: sparkSplitData.emotionalCompass.calm,
          Power: sparkSplitData.emotionalCompass.power
        }).map(([emotion, score]) => (
          <div key={emotion} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
              {emotion}
            </div>
            <div 
              style={{
                height: '4px',
                backgroundColor: emotion.toLowerCase() === sparkSplitData.emotionalCompass.dominantAxis 
                  ? '#2196F3' : '#e0e0e0',
                borderRadius: '2px',
                width: `${(score / 5) * 100}%`,
                margin: '0 auto',
                minWidth: '20px'
              }}
            />
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              {score.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '8px',
        fontStyle: 'italic'
      }}>
        Dominant emotional tone: {sparkSplitData.emotionalCompass.dominantAxis}
      </div>
    </div>
  );

  const TrustPulse = () => (
    !reducedMotion && (
      <div 
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '12px',
          height: '12px',
          backgroundColor: '#4CAF50',
          borderRadius: '50%',
          animation: 'trustPulse 3s ease-in-out',
          opacity: 0
        }}
        aria-hidden="true"
      />
    )
  );

  if (showTestimonialForm) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
        <h3 style={{ color: '#2196F3', marginBottom: '16px' }}>
          We're thrilled CanAI resonated with you! 🎉
        </h3>
        <p style={{ marginBottom: '24px', color: '#666' }}>
          Want to share what made it feel right? Your feedback helps us make CanAI even more you.
        </p>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            How did this output make you feel? (Optional)
          </label>
          <textarea
            value={feedback.testimonialContent}
            onChange={(e) => setFeedback({ ...feedback, testimonialContent: e.target.value })}
            placeholder="Share what resonated with you..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Emotional satisfaction (1-5)
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={feedback.emotionalSatisfactionScore}
            onChange={(e) => setFeedback({ ...feedback, emotionalSatisfactionScore: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
          <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            {feedback.emotionalSatisfactionScore}/5
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={feedback.wouldRefer}
              onChange={(e) => setFeedback({ ...feedback, wouldRefer: e.target.checked })}
            />
            I would refer CanAI to others
          </label>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={feedback.allowedForUse}
              onChange={(e) => setFeedback({ ...feedback, allowedForUse: e.target.checked })}
            />
            You may use my feedback for marketing (anonymous)
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleTestimonialSubmit}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Share Feedback
          </button>
          <button
            onClick={() => onUserSelection('canai')}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  if (showFeedbackForm) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
        <h3 style={{ color: '#FF9800', marginBottom: '16px' }}>
          Thanks for your honesty! 🤝
        </h3>
        <p style={{ marginBottom: '24px', color: '#666' }}>
          Want us to refine CanAI's output to better match your style?
        </p>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            What would make the output feel more like you?
          </label>
          <textarea
            value={feedback.finalFeedbackText}
            onChange={(e) => setFeedback({ ...feedback, finalFeedbackText: e.target.value })}
            placeholder="Tell us how we can improve..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={feedback.userRecoveryApproval}
              onChange={(e) => setFeedback({ ...feedback, userRecoveryApproval: e.target.checked })}
            />
            Yes, please regenerate with my feedback
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleFeedbackSubmit}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Submit Feedback
          </button>
          <button
            onClick={() => onUserSelection('sterile')}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: '#2196F3', marginBottom: '8px' }}>
          Your Voice, Amplified
        </h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          See how CanAI captures your unique spark, side by side with a standard AI response.
        </p>
        {isFirstTime && (
          <p style={{ 
            fontSize: '14px', 
            color: '#888', 
            fontStyle: 'italic',
            marginTop: '8px'
          }}>
            We show both to help you see how CanAI reflects your unique voice.
          </p>
        )}
      </div>

      {/* Sequential View Toggle */}
      {showSequential && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '4px' }}>
            <button
              onClick={() => setCurrentView('sterile')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: currentView === 'sterile' ? '#2196F3' : 'transparent',
                color: currentView === 'sterile' ? 'white' : '#666',
                cursor: 'pointer'
              }}
            >
              Standard AI
            </button>
            <button
              onClick={() => setCurrentView('canai')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: currentView === 'canai' ? '#2196F3' : 'transparent',
                color: currentView === 'canai' ? 'white' : '#666',
                cursor: 'pointer'
              }}
            >
              CanAI
            </button>
            <button
              onClick={() => setCurrentView('both')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: currentView === 'both' ? '#2196F3' : 'transparent',
                color: currentView === 'both' ? 'white' : '#666',
                cursor: 'pointer'
              }}
            >
              Side by Side
            </button>
          </div>
        </div>
      )}

      {/* Output Comparison */}
      <div style={{ 
        display: currentView === 'both' ? 'grid' : 'block',
        gridTemplateColumns: currentView === 'both' ? '1fr 1fr' : '1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Sterile Output */}
        {(currentView === 'sterile' || currentView === 'both') && (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#666', marginBottom: '4px' }}>
                Standard AI Response
              </h3>
              <p style={{ fontSize: '14px', color: '#888' }}>
                This is a direct, no-frills response to your prompt, like a standard AI might provide. 
                It prioritizes clarity and simplicity.
              </p>
            </div>
            
            <div 
              style={getOutputCardStyle('sterile')}
              onClick={() => setSelectedOutput('sterile')}
              role="button"
              tabIndex={0}
              aria-label="Select standard AI output"
            >
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                {sparkSplitData.sterileOutput}
              </div>
            </div>
          </div>
        )}

        {/* CanAI Output */}
        {(currentView === 'canai' || currentView === 'both') && (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#2196F3', marginBottom: '4px' }}>
                CanAI Response
              </h3>
              <p style={{ fontSize: '14px', color: '#888' }}>
                This response is tailored to your emotional style, tone, and intent, 
                designed to feel like an extension of you.
              </p>
            </div>
            
            <div 
              style={getOutputCardStyle('canai')}
              onClick={() => setSelectedOutput('canai')}
              role="button"
              tabIndex={0}
              aria-label="Select CanAI output"
            >
              <TrustPulse />
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                {sparkSplitData.canaiOutput}
              </div>
              
              <EmotionalCompass />
            </div>
          </div>
        )}
      </div>

      {/* Trust Delta Display */}
      {sparkSplitData.trustDelta > 0 && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            Trust Enhancement Score
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
            +{sparkSplitData.trustDelta.toFixed(1)}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            How much more CanAI resonates with your unique voice
          </div>
        </div>
      )}

      {/* Selection Prompt */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#333' }}>
          Which output feels more like you?
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleSelection('sterile')}
            style={{
              padding: '12px 24px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: selectedOutput === 'sterile' ? '#f0f0f0' : 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Standard AI
          </button>
          
          <button
            onClick={() => handleSelection('canai')}
            style={{
              padding: '12px 24px',
              border: '2px solid #2196F3',
              borderRadius: '8px',
              backgroundColor: selectedOutput === 'canai' ? '#2196F3' : 'white',
              color: selectedOutput === 'canai' ? 'white' : '#2196F3',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            CanAI
          </button>
          
          <button
            onClick={() => handleSelection('both')}
            style={{
              padding: '12px 24px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: selectedOutput === 'both' ? '#f0f0f0' : 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Both
          </button>
          
          <button
            onClick={() => handleSelection('neither')}
            style={{
              padding: '12px 24px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: selectedOutput === 'neither' ? '#f0f0f0' : 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Neither
          </button>
          
          <button
            onClick={() => handleSelection('skip')}
            style={{
              padding: '12px 24px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#666',
              cursor: 'pointer'
            }}
          >
            Skip
          </button>
        </div>
      </div>

      {/* Micro-animation for first-time users */}
      {isFirstTime && !reducedMotion && (
        <div style={{ 
          textAlign: 'center',
          fontSize: '14px',
          color: '#888',
          fontStyle: 'italic'
        }}>
          <div style={{ 
            display: 'inline-block',
            animation: 'gentleGlow 2s ease-in-out infinite alternate'
          }}>
            ✨ Take your time exploring both responses
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes trustPulse {
          0% { opacity: 0; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1); }
        }
        
        @keyframes gentleGlow {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}; 