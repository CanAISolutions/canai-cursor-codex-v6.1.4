/**
 * ToneAnalysisService Class
 * 
 * Analyzes the tone of text to detect emotional and language tones.
 * Provides insights into communication style, formality, and emotional content.
 * 
 * Note: This is a mock implementation for testing purposes.
 */
export class ToneAnalysisService {
  /**
   * Analyzes the tone of text
   * 
   * @param text - Text to analyze
   * @param options - Analysis options
   * @returns Tone analysis results
   */
  analyzeTone(text: string, options: ToneAnalysisOptions = {}): ToneAnalysis {
    const emotionalTones = this.analyzeEmotionalTones(text);
    const languageTones = this.analyzeLanguageTones(text);
    
    // Find dominant tones
    const dominantEmotionalTone = this.findDominantTone(emotionalTones);
    const dominantLanguageTone = this.findDominantTone(languageTones);
    
    return {
      emotionalTones,
      languageTones,
      dominantEmotionalTone,
      dominantLanguageTone,
      formality: this.analyzeFormalityLevel(text),
      confidence: 0.85
    };
  }
  
  /**
   * Analyzes emotional tones in text
   * 
   * @param text - Text to analyze
   * @returns Emotional tone scores
   */
  private analyzeEmotionalTones(text: string): ToneScore[] {
    const lowerText = text.toLowerCase();
    const tones: ToneScore[] = [];
    
    // Joy indicators
    const joyWords = ['happy', 'delighted', 'excited', 'pleased', 'thrilled', 'glad', 'joy'];
    const joyScore = this.calculateToneScore(lowerText, joyWords);
    if (joyScore > 0) {
      tones.push({ tone: 'joy', score: joyScore });
    }
    
    // Sadness indicators
    const sadnessWords = ['sad', 'unhappy', 'disappointed', 'regret', 'sorry', 'unfortunate'];
    const sadnessScore = this.calculateToneScore(lowerText, sadnessWords);
    if (sadnessScore > 0) {
      tones.push({ tone: 'sadness', score: sadnessScore });
    }
    
    // Anger indicators
    const angerWords = ['angry', 'upset', 'annoyed', 'frustrated', 'irritated', 'furious'];
    const angerScore = this.calculateToneScore(lowerText, angerWords);
    if (angerScore > 0) {
      tones.push({ tone: 'anger', score: angerScore });
    }
    
    // Fear indicators
    const fearWords = ['afraid', 'scared', 'worried', 'anxious', 'concerned', 'nervous'];
    const fearScore = this.calculateToneScore(lowerText, fearWords);
    if (fearScore > 0) {
      tones.push({ tone: 'fear', score: fearScore });
    }
    
    // Analytical indicators
    const analyticalWords = ['analyze', 'analysis', 'consider', 'evidence', 'examine', 'logical'];
    const analyticalScore = this.calculateToneScore(lowerText, analyticalWords);
    if (analyticalScore > 0) {
      tones.push({ tone: 'analytical', score: analyticalScore });
    }
    
    // Default to neutral if no strong tones detected
    if (tones.length === 0 || tones.every(tone => tone.score < 0.3)) {
      tones.push({ tone: 'neutral', score: 0.7 });
    }
    
    return tones;
  }
  
  /**
   * Analyzes language tones in text
   * 
   * @param text - Text to analyze
   * @returns Language tone scores
   */
  private analyzeLanguageTones(text: string): ToneScore[] {
    const lowerText = text.toLowerCase();
    const tones: ToneScore[] = [];
    
    // Confident indicators
    const confidentWords = ['certainly', 'definitely', 'absolutely', 'confident', 'sure', 'undoubtedly'];
    const confidentScore = this.calculateToneScore(lowerText, confidentWords);
    if (confidentScore > 0) {
      tones.push({ tone: 'confident', score: confidentScore });
    }
    
    // Tentative indicators
    const tentativeWords = ['maybe', 'perhaps', 'possibly', 'might', 'could', 'seems'];
    const tentativeScore = this.calculateToneScore(lowerText, tentativeWords);
    if (tentativeScore > 0) {
      tones.push({ tone: 'tentative', score: tentativeScore });
    }
    
    // Polite indicators
    const politeWords = ['please', 'thank you', 'kindly', 'appreciate', 'grateful'];
    const politeScore = this.calculateToneScore(lowerText, politeWords);
    if (politeScore > 0) {
      tones.push({ tone: 'polite', score: politeScore });
    }
    
    // Direct indicators
    const directWords = ['direct', 'precisely', 'exactly', 'clearly', 'specifically'];
    const directScore = this.calculateToneScore(lowerText, directWords);
    if (directScore > 0) {
      tones.push({ tone: 'direct', score: directScore });
    }
    
    // Default to neutral if no strong tones detected
    if (tones.length === 0) {
      tones.push({ tone: 'neutral', score: 0.7 });
    }
    
    return tones;
  }
  
  /**
   * Calculates a tone score based on keyword matching
   * 
   * @param text - Text to analyze (lowercase)
   * @param keywords - Tone keywords
   * @returns Score for the tone
   */
  private calculateToneScore(text: string, keywords: string[]): number {
    let matches = 0;
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        matches++;
      }
    });
    
    // Calculate score based on matches
    return matches > 0 ? Math.min(0.9, 0.3 + (matches * 0.2)) : 0;
  }
  
  /**
   * Finds the dominant tone from a list of tone scores
   * 
   * @param tones - List of tone scores
   * @returns Dominant tone or null if none
   */
  private findDominantTone(tones: ToneScore[]): ToneScore | null {
    if (tones.length === 0) {
      return null;
    }
    
    // Find tone with highest score
    return tones.reduce((dominant, current) => {
      return current.score > dominant.score ? current : dominant;
    }, tones[0]);
  }
  
  /**
   * Analyzes the formality level of text
   * 
   * @param text - Text to analyze
   * @returns Formality level (0-1)
   */
  private analyzeFormalityLevel(text: string): number {
    const lowerText = text.toLowerCase();
    
    // Formal indicators
    const formalIndicators = [
      'would you kindly', 'I would like to', 'please consider', 'thank you for your',
      'sincerely', 'regards', 'respectfully', 'in conclusion'
    ];
    
    // Informal indicators
    const informalIndicators = [
      'hey', 'hi there', 'thanks', 'awesome', 'cool', 'yeah', 'gonna', 'wanna',
      'btw', 'lol', 'haha', 'oops'
    ];
    
    let formalCount = 0;
    let informalCount = 0;
    
    formalIndicators.forEach(indicator => {
      if (lowerText.includes(indicator)) {
        formalCount++;
      }
    });
    
    informalIndicators.forEach(indicator => {
      if (lowerText.includes(indicator)) {
        informalCount++;
      }
    });
    
    // Calculate formality score
    if (formalCount === 0 && informalCount === 0) {
      return 0.5; // Neutral formality
    }
    
    // Scale from 0 (very informal) to 1 (very formal)
    return Math.min(1, Math.max(0, 0.5 + (formalCount * 0.1) - (informalCount * 0.1)));
  }
}

/**
 * Types for tone analysis
 */
export interface ToneAnalysisOptions {
  language?: string;
  includeSentenceTones?: boolean;
}

export interface ToneAnalysis {
  emotionalTones: ToneScore[];
  languageTones: ToneScore[];
  dominantEmotionalTone: ToneScore | null;
  dominantLanguageTone: ToneScore | null;
  formality: number;
  confidence: number;
}

export interface ToneScore {
  tone: string;
  score: number;
} 