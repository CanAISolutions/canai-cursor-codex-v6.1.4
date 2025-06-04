/**
 * EmotionDetectionService Class
 * 
 * Provides advanced emotion detection and analysis from text.
 * Detects nuanced emotional states and intensities beyond basic sentiment.
 * 
 * Note: This is a mock implementation for testing purposes.
 */
export class EmotionDetectionService {
  /**
   * Detects emotions in text
   * 
   * @param text - Text to analyze
   * @param options - Detection options
   * @returns Emotion detection results
   */
  detectEmotions(text: string, options: EmotionDetectionOptions = {}): EmotionDetectionResult {
    const emotions = this.analyzeEmotions(text);
    
    // Find primary and secondary emotions
    const sortedEmotions = [...emotions].sort((a, b) => b.score - a.score);
    const primaryEmotion = sortedEmotions.length > 0 ? sortedEmotions[0] : null;
    const secondaryEmotion = sortedEmotions.length > 1 ? sortedEmotions[1] : null;
    
    // Calculate overall emotional intensity
    const intensity = this.calculateOverallIntensity(emotions);
    
    // Detect emotional complexity
    const complexity = this.calculateEmotionalComplexity(emotions);
    
    return {
      emotions,
      primaryEmotion: primaryEmotion?.emotion || 'neutral',
      secondaryEmotion: secondaryEmotion?.emotion,
      intensity,
      complexity,
      language: options.language || 'en',
      confidence: 0.85
    };
  }
  
  /**
   * Analyzes emotions in text
   * 
   * @param text - Text to analyze
   * @returns Detected emotions with scores
   */
  private analyzeEmotions(text: string): EmotionScore[] {
    const lowerText = text.toLowerCase();
    const emotions: EmotionScore[] = [];
    
    // Joy emotion
    const joyWords = ['happy', 'delighted', 'pleased', 'glad', 'thrilled', 'excited', 'joy', 'wonderful', 'excellent'];
    const joyScore = this.calculateEmotionScore(lowerText, joyWords);
    if (joyScore > 0) {
      emotions.push({ emotion: 'joy', score: joyScore });
    }
    
    // Sadness emotion
    const sadnessWords = ['sad', 'unhappy', 'disappointed', 'upset', 'miserable', 'sorrowful', 'gloomy', 'downhearted'];
    const sadnessScore = this.calculateEmotionScore(lowerText, sadnessWords);
    if (sadnessScore > 0) {
      emotions.push({ emotion: 'sadness', score: sadnessScore });
    }
    
    // Anger emotion
    const angerWords = ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'enraged', 'irate'];
    const angerScore = this.calculateEmotionScore(lowerText, angerWords);
    if (angerScore > 0) {
      emotions.push({ emotion: 'anger', score: angerScore });
    }
    
    // Fear emotion
    const fearWords = ['afraid', 'scared', 'frightened', 'terrified', 'fearful', 'anxious', 'worried', 'nervous'];
    const fearScore = this.calculateEmotionScore(lowerText, fearWords);
    if (fearScore > 0) {
      emotions.push({ emotion: 'fear', score: fearScore });
    }
    
    // Disgust emotion
    const disgustWords = ['disgusted', 'revolted', 'repulsed', 'gross', 'distasteful', 'appalled', 'repelled'];
    const disgustScore = this.calculateEmotionScore(lowerText, disgustWords);
    if (disgustScore > 0) {
      emotions.push({ emotion: 'disgust', score: disgustScore });
    }
    
    // Surprise emotion
    const surpriseWords = ['surprised', 'amazed', 'astonished', 'shocked', 'startled', 'unexpected', 'wow'];
    const surpriseScore = this.calculateEmotionScore(lowerText, surpriseWords);
    if (surpriseScore > 0) {
      emotions.push({ emotion: 'surprise', score: surpriseScore });
    }
    
    // Trust emotion
    const trustWords = ['trust', 'confidence', 'believe', 'faith', 'reliable', 'dependable', 'certain', 'sure'];
    const trustScore = this.calculateEmotionScore(lowerText, trustWords);
    if (trustScore > 0) {
      emotions.push({ emotion: 'trust', score: trustScore });
    }
    
    // Anticipation emotion
    const anticipationWords = ['expect', 'anticipate', 'await', 'look forward', 'eager', 'hopeful', 'future'];
    const anticipationScore = this.calculateEmotionScore(lowerText, anticipationWords);
    if (anticipationScore > 0) {
      emotions.push({ emotion: 'anticipation', score: anticipationScore });
    }
    
    // If no emotions detected, default to neutral
    if (emotions.length === 0) {
      emotions.push({ emotion: 'neutral', score: 0.7 });
    }
    
    return emotions;
  }
  
  /**
   * Calculates emotion score based on keyword matching
   * 
   * @param text - Text to analyze (lowercase)
   * @param keywords - Emotion keywords
   * @returns Score for the emotion
   */
  private calculateEmotionScore(text: string, keywords: string[]): number {
    let matches = 0;
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        matches++;
      }
    });
    
    // Add bonus for exclamation marks which indicate intensity
    const exclamationCount = (text.match(/!/g) || []).length;
    const exclamationBonus = Math.min(0.2, exclamationCount * 0.05);
    
    // Calculate score based on matches
    return matches > 0 ? Math.min(0.95, 0.3 + (matches * 0.15) + exclamationBonus) : 0;
  }
  
  /**
   * Calculates overall emotional intensity
   * 
   * @param emotions - Detected emotions
   * @returns Overall intensity value (0-1)
   */
  private calculateOverallIntensity(emotions: EmotionScore[]): number {
    if (emotions.length === 0) {
      return 0.5; // Default intensity
    }
    
    // Weighted average of emotion scores, with higher weights for stronger emotions
    const totalWeight = emotions.reduce((sum, emotion) => sum + emotion.score, 0);
    
    if (totalWeight === 0) {
      return 0.5;
    }
    
    const weightedSum = emotions.reduce((sum, emotion) => {
      return sum + (emotion.score * emotion.score); // Square for more emphasis on strong emotions
    }, 0);
    
    return Math.min(1, weightedSum / totalWeight);
  }
  
  /**
   * Calculates emotional complexity
   * 
   * @param emotions - Detected emotions
   * @returns Complexity score (0-1)
   */
  private calculateEmotionalComplexity(emotions: EmotionScore[]): number {
    if (emotions.length <= 1) {
      return 0.1; // Low complexity with only one emotion
    }
    
    // More distinct emotions = higher complexity
    const distinctEmotionsScore = Math.min(0.5, (emotions.length - 1) * 0.1);
    
    // Mixed opposite emotions = higher complexity
    let oppositeEmotionsScore = 0;
    
    // Check for opposites (joy vs sadness, trust vs disgust, etc.)
    const hasJoy = emotions.some(e => e.emotion === 'joy' && e.score > 0.3);
    const hasSadness = emotions.some(e => e.emotion === 'sadness' && e.score > 0.3);
    
    const hasTrust = emotions.some(e => e.emotion === 'trust' && e.score > 0.3);
    const hasDisgust = emotions.some(e => e.emotion === 'disgust' && e.score > 0.3);
    
    const hasAnger = emotions.some(e => e.emotion === 'anger' && e.score > 0.3);
    const hasFear = emotions.some(e => e.emotion === 'fear' && e.score > 0.3);
    
    if ((hasJoy && hasSadness) || (hasTrust && hasDisgust) || (hasAnger && hasFear)) {
      oppositeEmotionsScore = 0.4;
    }
    
    // Calculate final complexity
    return Math.min(1, 0.1 + distinctEmotionsScore + oppositeEmotionsScore);
  }
}

/**
 * Types for emotion detection
 */
export interface EmotionDetectionOptions {
  language?: string;
  includeContextualFactors?: boolean;
}

export interface EmotionDetectionResult {
  emotions: EmotionScore[];
  primaryEmotion: string;
  secondaryEmotion?: string;
  intensity: number;
  complexity: number;
  language: string;
  confidence: number;
}

export interface EmotionScore {
  emotion: string;
  score: number;
} 