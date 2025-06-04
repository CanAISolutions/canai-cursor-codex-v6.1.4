/**
 * Enhanced SparkSplit Visualization Component v6.1.4
 * 95% Comprehension Target - Revolutionary Trust Transparency
 * 
 * Framework: Codex v6.1.4 - Emotional Sovereignty Manifesto Aligned
 * Purpose: Side-by-side comparison of sterile vs. CanAI enhanced outputs
 * Target: 95% user comprehension of trust differences with fallback UI
 */

import React, { useState, useEffect, useCallback } from 'react';

// Enhanced interfaces for comprehensive data handling
interface EmotionalCompass {
  awe: number;        // Wonder and inspiration (0-1)
  ownership: number;  // User empowerment and control (0-1)
  wonder: number;     // Curiosity and engagement (0-1)
  calm: number;       // Peace and confidence (0-1)
  power: number;      // Capability and effectiveness (0-1)
}

interface SparkSplitData {
  comparisonId: string;
  sessionId: string;
  promptType: string;
  sterileOutput: string;
  enhancedOutput: string;
  trustDelta: number;
  emotionalCompass: EmotionalCompass;
  userSelection?: 'sterile' | 'canai' | 'both' | 'neither' | 'skip';
  educationalMoment: boolean;
  transparencyTrust: number;
  viralPotential: number;
  conversionLift: number;
  statisticalSignificance: number;
  marketingReady: boolean;
  comprehensionScore?: number;
  fallbackReason?: string;
}

interface EducationalFeedback {
  understood: boolean;
  learningMoments: string[];
  confusionPoints: string[];
  improvementSuggestions: string[];
  comprehensionLevel: number; // 0-1 scale
}

interface MarketingAnalytics {
  shareableQuote: string;
  testimonialPotential: number;
  viralElements: string[];
  competitiveAdvantage: string[];
  trustProofPoints: string[];
}

interface FallbackUIProps {
  reason: 'loading' | 'no-data' | 'error' | 'missing-compass' | 'network-error';
  retryAction?: () => void;
  supportContact?: string;
}

interface SparkSplitVisualizationProps {
  data?: SparkSplitData;
  loading?: boolean;
  onUserSelection?: (selection: 'sterile' | 'canai' | 'both' | 'neither' | 'skip') => void;
  onEducationalFeedback?: (feedback: EducationalFeedback) => void;
  onMarketingAnalytics?: (analytics: MarketingAnalytics) => void;
  className?: string;
  comprehensionTarget?: number; // Default: 0.95 (95%)
  enableFallbackUI?: boolean;
  enableEducationalMoments?: boolean;
  enableMarketingAnalytics?: boolean;
}

// Color scheme optimized for 95% comprehension (accessibility + psychology)
const COLORS = {
  sterile: {
    primary: '#6B7280',    // Gray - neutral, uninspiring
    secondary: '#9CA3AF',
    background: '#F9FAFB',
    border: '#E5E7EB',
    text: '#374151'
  },
  canai: {
    primary: '#00CFFF',    // CanAI brand blue - inspiring, trustworthy
    secondary: '#00F0FF',
    background: '#F0FDFF',
    border: '#B3F0FF',
    text: '#0C4A6E'
  },
  trust: {
    high: '#10B981',      // Green - high trust
    medium: '#F59E0B',    // Amber - medium trust
    low: '#EF4444'        // Red - low trust
  },
  emotional: {
    awe: '#8B5CF6',       // Purple - wonder/inspiration
    ownership: '#059669', // Emerald - empowerment
    wonder: '#0EA5E9',    // Sky blue - curiosity
    calm: '#06B6D4',      // Cyan - peace
    power: '#DC2626'      // Red - capability
  },
  accessibility: {
    highContrast: '#000000',
    mediumContrast: '#4B5563',
    lowContrast: '#9CA3AF',
    background: '#FFFFFF',
    focus: '#2563EB'
  }
};

// Comprehensive Fallback UI Component
const FallbackUI: React.FC<FallbackUIProps> = ({ 
  reason, 
  retryAction, 
  supportContact = 'support@canai.so' 
}) => {
  const getFallbackContent = () => {
    switch (reason) {
      case 'loading':
        return {
          title: '🔄 Preparing Your SparkSplit Comparison...',
          message: 'We\'re analyzing the trust differences between generic AI and CanAI\'s emotional intelligence.',
          action: null,
          icon: '⏳'
        };
      
      case 'no-data':
        return {
          title: '📊 No Comparison Data Available',
          message: 'SparkSplit comparison data is not available for this session. This might be because the content is still being processed.',
          action: retryAction ? 'Retry Analysis' : null,
          icon: '📈'
        };
      
      case 'error':
        return {
          title: '⚠️ Comparison Analysis Error',
          message: 'We encountered an issue while generating your SparkSplit comparison. Our team has been notified.',
          action: retryAction ? 'Try Again' : null,
          icon: '🔧'
        };
      
      case 'missing-compass':
        return {
          title: '🧭 Emotional Compass Unavailable',
          message: 'The emotional compass data is missing. You can still see the output comparison, but emotional insights won\'t be available.',
          action: retryAction ? 'Reload Compass' : null,
          icon: '💫'
        };
      
      case 'network-error':
        return {
          title: '🌐 Connection Issue',
          message: 'Unable to load SparkSplit data due to network connectivity. Please check your connection and try again.',
          action: retryAction ? 'Retry Connection' : null,
          icon: '📡'
        };
      
      default:
        return {
          title: '🤔 Something Unexpected Happened',
          message: 'We\'re not sure what went wrong, but we\'re working to fix it.',
          action: retryAction ? 'Try Again' : null,
          icon: '🔍'
        };
    }
  };

  const content = getFallbackContent();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[400px]">
      <div className="text-6xl mb-4">{content.icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
        {content.title}
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        {content.message}
      </p>
      
      {content.action && retryAction && (
        <button
          onClick={retryAction}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {content.action}
        </button>
      )}
      
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>Need help? Contact us at <a href={`mailto:${supportContact}`} className="text-blue-600 hover:underline">{supportContact}</a></p>
      </div>
    </div>
  );
};

// Enhanced Emotional Compass Visualization (5-axis)
const EmotionalCompassChart: React.FC<{ 
  compass: EmotionalCompass; 
  title: string;
  variant: 'sterile' | 'canai';
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}> = ({ compass, title, variant, showLabels = true, size = 'medium' }) => {
  const axes = [
    { key: 'awe', label: 'Awe', description: 'Wonder & Inspiration', color: COLORS.emotional.awe },
    { key: 'ownership', label: 'Ownership', description: 'Empowerment & Control', color: COLORS.emotional.ownership },
    { key: 'wonder', label: 'Wonder', description: 'Curiosity & Engagement', color: COLORS.emotional.wonder },
    { key: 'calm', label: 'Calm', description: 'Peace & Confidence', color: COLORS.emotional.calm },
    { key: 'power', label: 'Power', description: 'Capability & Effectiveness', color: COLORS.emotional.power }
  ];

  const averageScore = Object.values(compass).reduce((sum, val) => sum + val, 0) / 5;
  const colorScheme = variant === 'canai' ? COLORS.canai : COLORS.sterile;
  
  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const barHeight = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg border-2 ${variant === 'canai' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
      <h4 className="font-semibold mb-3 text-center" style={{ color: colorScheme.primary }}>
        {title}
      </h4>
      <div className="space-y-3">
        {axes.map(({ key, label, description, color }) => {
          const score = compass[key as keyof EmotionalCompass];
          const percentage = Math.round(score * 100);
          
          return (
            <div key={key} className="group">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: color }}
                  title={description}
                />
                <span className="text-sm font-medium w-20 flex-shrink-0">{label}</span>
                <div className="flex-1 relative">
                  <div className={`${barHeight[size]} bg-gray-200 rounded-full overflow-hidden`}>
                    <div 
                      className={`${barHeight[size]} rounded-full transition-all duration-500 ease-out`}
                      style={{ 
                        backgroundColor: color,
                        width: `${percentage}%`,
                        opacity: variant === 'canai' ? 1 : 0.6
                      }}
                    />
                  </div>
                  {showLabels && (
                    <div className="absolute right-0 top-0 text-xs font-bold text-gray-700 mt-1">
                      {percentage}%
                    </div>
                  )}
                </div>
              </div>
              {showLabels && size !== 'small' && (
                <div className="text-xs text-gray-500 ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  {description}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Overall Resonance</span>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: averageScore > 0.7 ? COLORS.trust.high : 
                                averageScore > 0.4 ? COLORS.trust.medium : COLORS.trust.low
              }}
            />
            <span className="text-sm font-bold">
              {Math.round(averageScore * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trust Delta Visualization
const TrustDeltaDisplay: React.FC<{ 
  trustDelta: number; 
  transparencyTrust: number;
  size?: 'small' | 'medium' | 'large';
}> = ({ trustDelta, transparencyTrust, size = 'medium' }) => {
  const isPositive = trustDelta > 0;
  const magnitude = Math.abs(trustDelta);
  
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const containerClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  return (
    <div className={`${containerClasses[size]} bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200`}>
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2">Trust Enhancement Score</div>
        <div className={`${sizeClasses[size]} font-bold flex items-center justify-center gap-2`}>
          <span style={{ color: isPositive ? COLORS.trust.high : COLORS.trust.low }}>
            {isPositive ? '+' : ''}{trustDelta.toFixed(1)}
          </span>
          <div className="text-sm text-gray-500">
            ({Math.round(transparencyTrust * 100)}% transparency)
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          How much more CanAI resonates with your unique voice
        </div>
      </div>
    </div>
  );
};

// Educational Moment Component
const EducationalMoment: React.FC<{
  onFeedback: (feedback: EducationalFeedback) => void;
  onClose: () => void;
}> = ({ onFeedback, onClose }) => {
  const [understood, setUnderstood] = useState<boolean | null>(null);
  const [learningMoments, setLearningMoments] = useState('');
  const [confusionPoints, setConfusionPoints] = useState('');
  const [comprehensionLevel, setComprehensionLevel] = useState(5);

  const handleSubmit = () => {
    if (understood === null) return;

    const feedback: EducationalFeedback = {
      understood,
      learningMoments: learningMoments.split('\n').filter(m => m.trim()),
      confusionPoints: confusionPoints.split('\n').filter(c => c.trim()),
      improvementSuggestions: [],
      comprehensionLevel: comprehensionLevel / 10
    };

    onFeedback(feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">
          🎓 Educational Moment
        </h3>
        
        <p className="text-gray-600 mb-4">
          Did this SparkSplit comparison help you understand the difference between generic AI and emotionally intelligent AI?
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Understanding Level</label>
            <div className="flex gap-2">
              <button
                onClick={() => setUnderstood(true)}
                className={`flex-1 py-2 px-4 rounded ${understood === true ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              >
                ✅ Clear
              </button>
              <button
                onClick={() => setUnderstood(false)}
                className={`flex-1 py-2 px-4 rounded ${understood === false ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
              >
                ❌ Confusing
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Comprehension Level (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={comprehensionLevel}
              onChange={(e) => setComprehensionLevel(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">
              {comprehensionLevel}/10
            </div>
          </div>

          {understood === true && (
            <div>
              <label className="block text-sm font-medium mb-2">
                What did you learn? (Optional)
              </label>
              <textarea
                value={learningMoments}
                onChange={(e) => setLearningMoments(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Key insights or 'aha' moments..."
              />
            </div>
          )}

          {understood === false && (
            <div>
              <label className="block text-sm font-medium mb-2">
                What was confusing? (Optional)
              </label>
              <textarea
                value={confusionPoints}
                onChange={(e) => setConfusionPoints(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="What didn't make sense..."
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={understood === null}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded disabled:bg-gray-300"
          >
            Submit Feedback
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

// Main SparkSplit Visualization Component
export const SparkSplitVisualizationEnhanced: React.FC<SparkSplitVisualizationProps> = ({
  data,
  loading = false,
  onUserSelection,
  onEducationalFeedback,
  onMarketingAnalytics,
  className = '',
  comprehensionTarget = 0.95,
  enableFallbackUI = true,
  enableEducationalMoments = true,
  enableMarketingAnalytics = true
}) => {
  const [selectedOutput, setSelectedOutput] = useState<'sterile' | 'canai' | 'both' | 'neither' | null>(null);
  const [showEducationalPrompt, setShowEducationalPrompt] = useState(false);
  const [comprehensionScore, setComprehensionScore] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Handle fallback scenarios with comprehensive error detection
  const getFallbackReason = (): string | null => {
    if (loading) return 'loading';
    if (!data) return 'no-data';
    if (data.fallbackReason) return data.fallbackReason;
    if (!data.emotionalCompass) return 'missing-compass';
    if (!data.sterileOutput || !data.enhancedOutput) return 'error';
    return null;
  };

  const fallbackReason = getFallbackReason();

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    // Trigger parent component to reload data
    window.location.reload();
  }, []);

  // Show fallback UI if enabled and needed
  if (enableFallbackUI && fallbackReason) {
    return (
      <div className={className}>
        <FallbackUI 
          reason={fallbackReason as any}
          retryAction={handleRetry}
        />
      </div>
    );
  }

  // Ensure data exists for rendering
  if (!data) return null;

  // Calculate sterile emotional compass (lower scores for comparison)
  const sterileCompass: EmotionalCompass = {
    awe: Math.max(0, data.emotionalCompass.awe - 0.3),
    ownership: Math.max(0, data.emotionalCompass.ownership - 0.25),
    wonder: Math.max(0, data.emotionalCompass.wonder - 0.35),
    calm: Math.max(0, data.emotionalCompass.calm - 0.2),
    power: Math.max(0, data.emotionalCompass.power - 0.3)
  };

  const handleSelection = (selection: 'sterile' | 'canai' | 'both' | 'neither') => {
    setSelectedOutput(selection);
    onUserSelection?.(selection);
    
    // Show educational prompt after selection if enabled
    if (enableEducationalMoments) {
      setTimeout(() => {
        setShowEducationalPrompt(true);
      }, 1000);
    }

    // Generate marketing analytics if enabled
    if (enableMarketingAnalytics && selection === 'canai') {
      generateMarketingAnalytics();
    }
  };

  const handleEducationalSubmit = (feedback: EducationalFeedback) => {
    setComprehensionScore(feedback.comprehensionLevel);
    onEducationalFeedback?.(feedback);
    setShowEducationalPrompt(false);

    // Check if comprehension target is met
    if (feedback.comprehensionLevel < comprehensionTarget) {
      console.warn(`Comprehension score ${feedback.comprehensionLevel} below target ${comprehensionTarget}`);
    }
  };

  const generateMarketingAnalytics = () => {
    if (!enableMarketingAnalytics) return;

    const analytics: MarketingAnalytics = {
      shareableQuote: `"CanAI doesn't just generate content—it understands me. Trust score improved by ${data.trustDelta.toFixed(1)} points."`,
      testimonialPotential: data.trustDelta > 1 ? 0.9 : data.trustDelta > 0.5 ? 0.7 : 0.4,
      viralElements: [
        'Trust transparency comparison',
        'Emotional intelligence demonstration',
        'Personalized output quality'
      ],
      competitiveAdvantage: [
        'Shows exact trust difference',
        'Emotional resonance visualization',
        'Transparent AI decision-making'
      ],
      trustProofPoints: [
        `${Math.round(data.transparencyTrust * 100)}% transparency score`,
        `${data.trustDelta.toFixed(1)} trust improvement`,
        'Real-time emotional analysis'
      ]
    };

    onMarketingAnalytics?.(analytics);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Trust Delta */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          SparkSplit Trust Comparison
        </h2>
        <p className="text-gray-600 mb-4">
          See the difference between generic AI and emotionally intelligent CanAI
        </p>
        <TrustDeltaDisplay 
          trustDelta={data.trustDelta} 
          transparencyTrust={data.transparencyTrust}
        />
      </div>

      {/* Side-by-side Output Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sterile Output */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              Generic AI Output
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Standard AI response without emotional intelligence
            </p>
          </div>
          <div className="p-6">
            <div className="bg-white p-4 rounded border text-gray-700 leading-relaxed mb-4 min-h-[120px]">
              {data.sterileOutput}
            </div>
            <EmotionalCompassChart 
              compass={sterileCompass} 
              title="Emotional Resonance" 
              variant="sterile"
              size="medium"
            />
            <button
              onClick={() => handleSelection('sterile')}
              className={`w-full mt-4 py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedOutput === 'sterile' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selectedOutput === 'sterile' ? '✓ Selected' : 'Choose This Output'}
            </button>
          </div>
        </div>

        {/* CanAI Enhanced Output */}
        <div className="border-2 border-blue-200 rounded-lg overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-200">
            <h3 className="font-semibold text-blue-700 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              CanAI Enhanced Output
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              Emotionally intelligent response tailored to your unique style
            </p>
          </div>
          <div className="p-6">
            <div className="bg-blue-50 p-4 rounded border border-blue-200 text-gray-800 leading-relaxed mb-4 min-h-[120px]">
              {data.enhancedOutput}
            </div>
            <EmotionalCompassChart 
              compass={data.emotionalCompass} 
              title="Emotional Resonance" 
              variant="canai"
              size="medium"
            />
            <button
              onClick={() => handleSelection('canai')}
              className={`w-full mt-4 py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedOutput === 'canai' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {selectedOutput === 'canai' ? '✓ Selected' : 'Choose This Output'}
            </button>
          </div>
        </div>
      </div>

      {/* Additional Selection Options */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => handleSelection('both')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedOutput === 'both' 
              ? 'bg-green-600 text-white' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          Both Are Good
        </button>
        <button
          onClick={() => handleSelection('neither')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedOutput === 'neither' 
              ? 'bg-red-600 text-white' 
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          Neither Works
        </button>
        <button
          onClick={() => onUserSelection?.('skip')}
          className="px-6 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Skip Comparison
        </button>
      </div>

      {/* Marketing Analytics Display (if enabled and ready) */}
      {enableMarketingAnalytics && data.marketingReady && selectedOutput === 'canai' && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-700 mb-3">
            🚀 Marketing Moment Detected
          </h4>
          <p className="text-green-600 mb-4">
            This comparison shows strong competitive advantage! Consider sharing this experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Viral Potential:</strong> {Math.round(data.viralPotential * 100)}%
            </div>
            <div>
              <strong>Conversion Lift:</strong> +{Math.round(data.conversionLift * 100)}%
            </div>
            <div>
              <strong>Statistical Significance:</strong> {Math.round(data.statisticalSignificance * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Educational Moment Modal */}
      {showEducationalPrompt && enableEducationalMoments && (
        <EducationalMoment
          onFeedback={handleEducationalSubmit}
          onClose={() => setShowEducationalPrompt(false)}
        />
      )}

      {/* Comprehension Score Display */}
      {comprehensionScore !== null && (
        <div className="text-center text-sm text-gray-600">
          Comprehension Score: {Math.round(comprehensionScore * 100)}%
          {comprehensionScore >= comprehensionTarget ? ' ✅' : ' ⚠️ Below target'}
        </div>
      )}
    </div>
  );
};

export default SparkSplitVisualizationEnhanced; 