/**
 * Emotional Sovereignty Core - Advanced Emotional Intelligence System
 * Based on comprehensive DreamState testing infrastructure
 */

class EmotionalSovereigntyCore {
  constructor(options = {}) {
    this.memoryEnabled = options.memoryEnabled || true;
    this.spectrumAnalysis = options.spectrumAnalysis || true;
    this.adaptiveUX = options.adaptiveUX || true;
    this.continuityTracking = options.continuityTracking || true;
    
    // Initialize emotional memory bank
    this.emotionalMemory = new Map();
    this.emotionalSpectrum = this.initializeEmotionalSpectrum();
    this.uxAdaptations = new Map();
    
    console.log('🧠 Emotional Sovereignty Core initialized');
    console.log(`✅ Memory: ${this.memoryEnabled ? 'ENABLED' : 'DISABLED'}`);
    console.log(`✅ Spectrum Analysis: ${this.spectrumAnalysis ? 'ENABLED' : 'DISABLED'}`);
    console.log(`✅ Adaptive UX: ${this.adaptiveUX ? 'ENABLED' : 'DISABLED'}`);
    console.log(`✅ Continuity Tracking: ${this.continuityTracking ? 'ENABLED' : 'DISABLED'}`);
  }

  initializeEmotionalSpectrum() {
    return {
      // Primary emotions with intensity ranges
      joy: { range: [0.1, 1.0], indicators: ['excited', 'happy', 'delighted', 'ecstatic'] },
      trust: { range: [0.1, 1.0], indicators: ['confident', 'secure', 'assured', 'certain'] },
      fear: { range: [0.1, 1.0], indicators: ['worried', 'anxious', 'concerned', 'terrified'] },
      surprise: { range: [0.1, 1.0], indicators: ['amazed', 'astonished', 'shocked', 'stunned'] },
      sadness: { range: [0.1, 1.0], indicators: ['disappointed', 'melancholy', 'grieving', 'devastated'] },
      disgust: { range: [0.1, 1.0], indicators: ['displeased', 'repulsed', 'revolted', 'nauseated'] },
      anger: { range: [0.1, 1.0], indicators: ['annoyed', 'frustrated', 'furious', 'enraged'] },
      anticipation: { range: [0.1, 1.0], indicators: ['hopeful', 'eager', 'excited', 'impatient'] },
      
      // Complex emotional states
      optimism: { combination: ['joy', 'anticipation'], intensity: 0.7 },
      love: { combination: ['joy', 'trust'], intensity: 0.8 },
      submission: { combination: ['trust', 'fear'], intensity: 0.5 },
      awe: { combination: ['surprise', 'fear'], intensity: 0.6 },
      disappointment: { combination: ['surprise', 'sadness'], intensity: 0.4 },
      remorse: { combination: ['sadness', 'disgust'], intensity: 0.5 },
      contempt: { combination: ['disgust', 'anger'], intensity: 0.6 },
      aggressiveness: { combination: ['anger', 'anticipation'], intensity: 0.7 }
    };
  }

  async analyzeEmotionalState(content, context = {}) {
    const analysis = {
      primaryEmotion: null,
      intensity: 0,
      secondaryEmotions: [],
      emotionalComplexity: 0,
      culturalContext: context.culture || 'universal',
      timestamp: new Date().toISOString(),
      traceId: context.traceId || this.generateTraceId()
    };

    // Advanced emotional analysis based on DreamState testing patterns
    const emotionalIndicators = this.extractEmotionalIndicators(content);
    const primaryEmotion = this.identifyPrimaryEmotion(emotionalIndicators);
    const intensity = this.calculateEmotionalIntensity(emotionalIndicators, primaryEmotion);
    const secondaryEmotions = this.identifySecondaryEmotions(emotionalIndicators, primaryEmotion);

    analysis.primaryEmotion = primaryEmotion;
    analysis.intensity = intensity;
    analysis.secondaryEmotions = secondaryEmotions;
    analysis.emotionalComplexity = this.calculateEmotionalComplexity(primaryEmotion, secondaryEmotions);

    // Store in emotional memory if enabled
    if (this.memoryEnabled && context.sessionId) {
      this.storeEmotionalMemory(context.sessionId, analysis);
    }

    return analysis;
  }

  extractEmotionalIndicators(content) {
    const indicators = {
      positive: [],
      negative: [],
      neutral: [],
      intensity: []
    };

    // Enhanced emotional indicator extraction based on DreamState patterns
    const words = content.toLowerCase().split(/\s+/);
    
    // Positive emotional indicators
    const positivePatterns = [
      'amazing', 'excellent', 'fantastic', 'wonderful', 'brilliant', 'outstanding',
      'love', 'adore', 'cherish', 'treasure', 'appreciate', 'grateful',
      'excited', 'thrilled', 'delighted', 'ecstatic', 'overjoyed',
      'confident', 'assured', 'certain', 'secure', 'trust', 'believe',
      'hopeful', 'optimistic', 'positive', 'bright', 'promising'
    ];

    // Negative emotional indicators
    const negativePatterns = [
      'terrible', 'awful', 'horrible', 'dreadful', 'disgusting', 'revolting',
      'hate', 'despise', 'loathe', 'detest', 'abhor',
      'angry', 'furious', 'enraged', 'livid', 'irate', 'mad',
      'sad', 'depressed', 'miserable', 'devastated', 'heartbroken',
      'worried', 'anxious', 'fearful', 'terrified', 'scared', 'afraid',
      'disappointed', 'frustrated', 'annoyed', 'irritated'
    ];

    // Intensity modifiers
    const intensityModifiers = [
      'extremely', 'incredibly', 'absolutely', 'completely', 'totally',
      'very', 'really', 'quite', 'rather', 'somewhat', 'slightly'
    ];

    words.forEach(word => {
      if (positivePatterns.includes(word)) {
        indicators.positive.push(word);
      } else if (negativePatterns.includes(word)) {
        indicators.negative.push(word);
      } else if (intensityModifiers.includes(word)) {
        indicators.intensity.push(word);
      } else {
        indicators.neutral.push(word);
      }
    });

    return indicators;
  }

  identifyPrimaryEmotion(indicators) {
    const emotionScores = {};

    // Score emotions based on indicators
    Object.keys(this.emotionalSpectrum).forEach(emotion => {
      const spectrum = this.emotionalSpectrum[emotion];
      if (spectrum.indicators) {
        let score = 0;
        spectrum.indicators.forEach(indicator => {
          if (indicators.positive.includes(indicator) || indicators.negative.includes(indicator)) {
            score += 1;
          }
        });
        emotionScores[emotion] = score;
      }
    });

    // Find emotion with highest score
    let primaryEmotion = 'neutral';
    let maxScore = 0;
    Object.entries(emotionScores).forEach(([emotion, score]) => {
      if (score > maxScore) {
        maxScore = score;
        primaryEmotion = emotion;
      }
    });

    return primaryEmotion;
  }

  calculateEmotionalIntensity(indicators, primaryEmotion) {
    let baseIntensity = 0.5;
    
    // Adjust based on emotional indicators
    const totalIndicators = indicators.positive.length + indicators.negative.length;
    const intensityBoost = Math.min(totalIndicators * 0.1, 0.4);
    
    // Adjust based on intensity modifiers
    const intensityModifierBoost = indicators.intensity.length * 0.05;
    
    const finalIntensity = Math.min(baseIntensity + intensityBoost + intensityModifierBoost, 1.0);
    return Math.max(finalIntensity, 0.1);
  }

  identifySecondaryEmotions(indicators, primaryEmotion) {
    const secondaryEmotions = [];
    
    // Look for complex emotional combinations
    Object.entries(this.emotionalSpectrum).forEach(([emotion, spectrum]) => {
      if (emotion !== primaryEmotion && spectrum.combination) {
        if (spectrum.combination.includes(primaryEmotion)) {
          secondaryEmotions.push({
            emotion,
            intensity: spectrum.intensity || 0.5,
            relationship: 'combination'
          });
        }
      }
    });

    return secondaryEmotions.slice(0, 3); // Limit to top 3 secondary emotions
  }

  calculateEmotionalComplexity(primaryEmotion, secondaryEmotions) {
    let complexity = 0.3; // Base complexity
    
    // Add complexity for secondary emotions
    complexity += secondaryEmotions.length * 0.2;
    
    // Add complexity for emotional combinations
    const hasComplexCombinations = secondaryEmotions.some(se => 
      this.emotionalSpectrum[se.emotion]?.combination
    );
    if (hasComplexCombinations) {
      complexity += 0.3;
    }

    return Math.min(complexity, 1.0);
  }

  storeEmotionalMemory(sessionId, analysis) {
    if (!this.emotionalMemory.has(sessionId)) {
      this.emotionalMemory.set(sessionId, []);
    }
    
    const sessionMemory = this.emotionalMemory.get(sessionId);
    sessionMemory.push({
      ...analysis,
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 emotional states per session
    if (sessionMemory.length > 50) {
      sessionMemory.splice(0, sessionMemory.length - 50);
    }

    console.log(`💾 Stored emotional memory for session ${sessionId}: ${analysis.primaryEmotion} (${analysis.intensity.toFixed(2)})`);
  }

  getEmotionalHistory(sessionId) {
    return this.emotionalMemory.get(sessionId) || [];
  }

  async predictEmotionalNeeds(sessionId, currentContext = {}) {
    const history = this.getEmotionalHistory(sessionId);
    if (history.length === 0) {
      return {
        predictedNeed: 'emotional_connection',
        confidence: 0.5,
        recommendations: ['Build initial emotional rapport', 'Establish trust']
      };
    }

    // Analyze emotional trajectory
    const recentEmotions = history.slice(-5);
    const emotionalTrend = this.analyzeEmotionalTrend(recentEmotions);
    
    const prediction = {
      predictedNeed: this.determinePredictedNeed(emotionalTrend),
      confidence: this.calculatePredictionConfidence(emotionalTrend),
      recommendations: this.generateEmotionalRecommendations(emotionalTrend),
      emotionalTrend,
      timestamp: new Date().toISOString()
    };

    console.log(`🔮 Predicted emotional need for session ${sessionId}: ${prediction.predictedNeed} (confidence: ${prediction.confidence.toFixed(2)})`);
    return prediction;
  }

  analyzeEmotionalTrend(recentEmotions) {
    if (recentEmotions.length < 2) {
      return { direction: 'stable', velocity: 0, pattern: 'insufficient_data' };
    }

    const intensities = recentEmotions.map(e => e.intensity);
    const emotions = recentEmotions.map(e => e.primaryEmotion);

    // Calculate emotional velocity (rate of change)
    let totalChange = 0;
    for (let i = 1; i < intensities.length; i++) {
      totalChange += intensities[i] - intensities[i - 1];
    }
    const velocity = totalChange / (intensities.length - 1);

    // Determine direction
    let direction = 'stable';
    if (velocity > 0.1) direction = 'improving';
    else if (velocity < -0.1) direction = 'declining';

    // Detect patterns
    const uniqueEmotions = [...new Set(emotions)];
    let pattern = 'stable';
    if (uniqueEmotions.length === 1) pattern = 'consistent';
    else if (uniqueEmotions.length > 3) pattern = 'volatile';
    else pattern = 'transitioning';

    return { direction, velocity, pattern, uniqueEmotions };
  }

  determinePredictedNeed(emotionalTrend) {
    if (emotionalTrend.direction === 'declining') {
      return 'emotional_support';
    } else if (emotionalTrend.pattern === 'volatile') {
      return 'emotional_stability';
    } else if (emotionalTrend.direction === 'improving') {
      return 'emotional_amplification';
    } else if (emotionalTrend.pattern === 'consistent') {
      return 'emotional_variety';
    } else {
      return 'emotional_connection';
    }
  }

  calculatePredictionConfidence(emotionalTrend) {
    let confidence = 0.5;
    
    // Higher confidence for clear patterns
    if (Math.abs(emotionalTrend.velocity) > 0.2) confidence += 0.2;
    if (emotionalTrend.pattern !== 'insufficient_data') confidence += 0.2;
    
    return Math.min(confidence, 0.9);
  }

  generateEmotionalRecommendations(emotionalTrend) {
    const recommendations = [];
    
    switch (emotionalTrend.direction) {
      case 'declining':
        recommendations.push('Provide emotional support and reassurance');
        recommendations.push('Use empathetic language and validation');
        recommendations.push('Offer encouragement and positive reinforcement');
        break;
      case 'improving':
        recommendations.push('Amplify positive emotions with celebration');
        recommendations.push('Build on current momentum');
        recommendations.push('Introduce new challenges or opportunities');
        break;
      default:
        recommendations.push('Maintain current emotional tone');
        recommendations.push('Provide consistent emotional presence');
        break;
    }

    if (emotionalTrend.pattern === 'volatile') {
      recommendations.push('Focus on emotional stability and grounding');
      recommendations.push('Use calming and centering language');
    }

    return recommendations;
  }

  generateTraceId() {
    return 'esc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // UX Adaptation methods
  async adaptUXForEmotionalState(emotionalState, context = {}) {
    if (!this.adaptiveUX) {
      return { adapted: false, reason: 'Adaptive UX disabled' };
    }

    const adaptation = {
      colorScheme: this.getEmotionalColorScheme(emotionalState.primaryEmotion, emotionalState.intensity),
      typography: this.getEmotionalTypography(emotionalState.primaryEmotion),
      animations: this.getEmotionalAnimations(emotionalState.primaryEmotion, emotionalState.intensity),
      layout: this.getEmotionalLayout(emotionalState.emotionalComplexity),
      messaging: this.getEmotionalMessaging(emotionalState.primaryEmotion, emotionalState.intensity),
      adapted: true,
      timestamp: new Date().toISOString()
    };

    console.log(`🎨 Adapted UX for emotional state: ${emotionalState.primaryEmotion} (intensity: ${emotionalState.intensity.toFixed(2)})`);
    return adaptation;
  }

  getEmotionalColorScheme(emotion, intensity) {
    const schemes = {
      joy: { primary: '#FFD700', secondary: '#FFA500', accent: '#FF6347' },
      trust: { primary: '#4169E1', secondary: '#87CEEB', accent: '#00CED1' },
      fear: { primary: '#8B0000', secondary: '#CD5C5C', accent: '#F0E68C' },
      surprise: { primary: '#FF1493', secondary: '#FF69B4', accent: '#FFB6C1' },
      sadness: { primary: '#4682B4', secondary: '#708090', accent: '#B0C4DE' },
      anger: { primary: '#DC143C', secondary: '#B22222', accent: '#FF4500' },
      anticipation: { primary: '#32CD32', secondary: '#98FB98', accent: '#ADFF2F' },
      neutral: { primary: '#696969', secondary: '#A9A9A9', accent: '#D3D3D3' }
    };

    const baseScheme = schemes[emotion] || schemes.neutral;
    
    // Adjust intensity based on emotional intensity
    const intensityMultiplier = 0.5 + (intensity * 0.5);
    
    return {
      ...baseScheme,
      intensity: intensityMultiplier,
      emotion
    };
  }

  getEmotionalTypography(emotion) {
    const typography = {
      joy: { weight: 'bold', style: 'energetic', size: 'large' },
      trust: { weight: 'medium', style: 'stable', size: 'medium' },
      fear: { weight: 'light', style: 'cautious', size: 'small' },
      surprise: { weight: 'bold', style: 'dynamic', size: 'large' },
      sadness: { weight: 'light', style: 'gentle', size: 'medium' },
      anger: { weight: 'bold', style: 'strong', size: 'large' },
      anticipation: { weight: 'medium', style: 'forward', size: 'medium' },
      neutral: { weight: 'medium', style: 'balanced', size: 'medium' }
    };

    return typography[emotion] || typography.neutral;
  }

  getEmotionalAnimations(emotion, intensity) {
    const animations = {
      joy: { type: 'bounce', speed: 'fast', intensity: 'high' },
      trust: { type: 'fade', speed: 'medium', intensity: 'low' },
      fear: { type: 'shake', speed: 'fast', intensity: 'medium' },
      surprise: { type: 'pop', speed: 'instant', intensity: 'high' },
      sadness: { type: 'slow-fade', speed: 'slow', intensity: 'low' },
      anger: { type: 'pulse', speed: 'fast', intensity: 'high' },
      anticipation: { type: 'slide', speed: 'medium', intensity: 'medium' },
      neutral: { type: 'none', speed: 'medium', intensity: 'low' }
    };

    const baseAnimation = animations[emotion] || animations.neutral;
    baseAnimation.emotionalIntensity = intensity;
    
    return baseAnimation;
  }

  getEmotionalLayout(complexity) {
    if (complexity > 0.7) {
      return { type: 'complex', sections: 'multiple', focus: 'distributed' };
    } else if (complexity > 0.4) {
      return { type: 'balanced', sections: 'dual', focus: 'centered' };
    } else {
      return { type: 'simple', sections: 'single', focus: 'focused' };
    }
  }

  getEmotionalMessaging(emotion, intensity) {
    const messaging = {
      joy: {
        tone: 'celebratory',
        energy: 'high',
        examples: ['Fantastic!', 'Amazing work!', 'You\'re crushing it!']
      },
      trust: {
        tone: 'confident',
        energy: 'steady',
        examples: ['You\'ve got this', 'I believe in you', 'Steady progress']
      },
      fear: {
        tone: 'reassuring',
        energy: 'calm',
        examples: ['You\'re safe here', 'Take it one step at a time', 'I\'m here to help']
      },
      surprise: {
        tone: 'exciting',
        energy: 'dynamic',
        examples: ['Wow!', 'Incredible!', 'Look at that!']
      },
      sadness: {
        tone: 'empathetic',
        energy: 'gentle',
        examples: ['I understand', 'It\'s okay to feel this way', 'You\'re not alone']
      },
      anger: {
        tone: 'validating',
        energy: 'strong',
        examples: ['Your feelings are valid', 'Let\'s work through this', 'I hear you']
      },
      anticipation: {
        tone: 'encouraging',
        energy: 'forward',
        examples: ['Exciting things ahead!', 'Ready for the next step?', 'Let\'s make it happen']
      },
      neutral: {
        tone: 'balanced',
        energy: 'medium',
        examples: ['Let\'s continue', 'What would you like to do?', 'I\'m here to help']
      }
    };

    const baseMessaging = messaging[emotion] || messaging.neutral;
    baseMessaging.intensity = intensity;
    
    return baseMessaging;
  }

  // Health check and status methods
  getStatus() {
    return {
      emotionalSovereigntyCore: true,
      memoryEnabled: this.memoryEnabled,
      spectrumAnalysis: this.spectrumAnalysis,
      adaptiveUX: this.adaptiveUX,
      continuityTracking: this.continuityTracking,
      activeSessions: this.emotionalMemory.size,
      emotionalSpectrumSize: Object.keys(this.emotionalSpectrum).length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { EmotionalSovereigntyCore };
