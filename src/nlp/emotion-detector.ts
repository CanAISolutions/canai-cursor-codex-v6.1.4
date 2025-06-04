/**
 * NLPEmotionDetector Class
 * 
 * Provides advanced emotion detection in text using NLP techniques.
 * Analyzes emotional content, intensity, and sentiment across languages.
 */
import { Logger } from '../logger';
import { EventBus } from '../cursor/event-bus';

export class NLPEmotionDetector {
  private logger: Logger;
  private eventBus?: EventBus;
  private emotionPatterns: Map<string, RegExp[]>;
  private intensifierWords: string[];
  private diminisherWords: string[];
  private negationWords: string[];
  private primaryEmotions: string[];
  
  /**
   * Creates a new NLP emotion detector
   * 
   * @param logger - Optional logger instance
   * @param eventBus - Optional event bus for events
   */
  constructor(
    logger?: Logger,
    eventBus?: EventBus
  ) {
    this.logger = logger || new Logger('NLPEmotionDetector');
    this.eventBus = eventBus;
    
    // Define core emotions we want to detect
    this.primaryEmotions = [
      'joy', 'sadness', 'anger', 'fear', 
      'surprise', 'disgust', 'anticipation',
      'trust', 'empathy', 'gratitude', 
      'disappointment', 'excitement', 'neutral'
    ];
    
    // Initialize patterns for emotion detection
    this.emotionPatterns = this.initializeEmotionPatterns();
    
    // Initialize modifiers that affect emotion intensity
    this.intensifierWords = [
      'very', 'extremely', 'incredibly', 'absolutely', 'completely',
      'totally', 'utterly', 'really', 'particularly', 'especially',
      'exceptionally', 'extraordinarily', 'remarkably', 'exceedingly',
      'immensely', 'thoroughly', 'tremendously', 'intensely', 'highly',
      'acutely', 'drastically', 'deeply', 'profoundly', 'enormously',
      'hugely', 'greatly', 'substantially', 'significantly', 'awfully'
    ];
    
    this.diminisherWords = [
      'somewhat', 'slightly', 'a bit', 'a little', 'rather', 
      'kind of', 'sort of', 'moderately', 'fairly', 'quite',
      'just', 'only', 'barely', 'hardly', 'scarcely',
      'rarely', 'seldom', 'occasionally', 'somewhat', 'mildly',
      'lightly', 'partially', 'nominally', 'relatively', 'comparatively'
    ];
    
    this.negationWords = [
      'not', 'no', 'never', 'none', 'nothing', 'nowhere', 'neither',
      'nor', 'hardly', 'scarcely', 'barely', "don't", "doesn't", 
      "didn't", "wasn't", "weren't", "isn't", "aren't", "won't",
      "wouldn't", "can't", "couldn't", "shouldn't", "mustn't"
    ];
    
    this.logger.info('NLPEmotionDetector initialized');
  }
  
  /**
   * Detects emotion in text
   * 
   * @param text - Text to analyze
   * @returns Emotion analysis result
   */
  detectEmotion(text: string): EmotionAnalysisResult {
    try {
      if (!text) {
        return this.createNeutralResult();
      }
      
      // Normalize text for analysis
      const normalizedText = this.normalizeText(text);
      
      // Check for negations
      const hasNegation = this.containsNegation(normalizedText);
      
      // Initialize emotion scores
      const emotions: Record<string, number> = {};
      this.primaryEmotions.forEach(emotion => {
        emotions[emotion] = 0;
      });
      
      // Analyze text for each emotion
      this.emotionPatterns.forEach((patterns, emotion) => {
        let score = this.calculateEmotionScore(normalizedText, patterns);
        
        // Adjust score if negation is present
        if (hasNegation && emotion !== 'neutral') {
          score = Math.max(0, score - 0.4);
        }
        
        emotions[emotion] = score;
      });
      
      // Ensure neutral has a baseline score
      emotions['neutral'] = Math.max(0.2, emotions['neutral']);
      
      // Adjust intensity based on intensifiers and diminishers
      const intensityModifier = this.calculateIntensityModifier(normalizedText);
      
      // Find primary emotion (highest score)
      let primaryEmotion = 'neutral';
      let maxScore = 0;
      
      Object.entries(emotions).forEach(([emotion, score]) => {
        if (score > maxScore) {
          maxScore = score;
          primaryEmotion = emotion;
        }
      });
      
      // Calculate overall intensity (0-1)
      const baseIntensity = maxScore;
      const adjustedIntensity = Math.min(1, Math.max(0, baseIntensity * (1 + intensityModifier)));
      
      // Normalize emotion scores to sum to 1
      const totalScore = Object.values(emotions).reduce((sum, score) => sum + score, 0);
      if (totalScore > 0) {
        Object.keys(emotions).forEach(emotion => {
          emotions[emotion] = emotions[emotion] / totalScore;
        });
      }
      
      // Emit emotion detection event if event bus is available
      if (this.eventBus) {
        this.eventBus.emit('emotionDetected', {
          primaryEmotion,
          intensity: adjustedIntensity,
          emotions,
          textLength: text.length
        });
      }
      
      return {
        primaryEmotion,
        intensity: adjustedIntensity,
        emotions
      };
    } catch (error) {
      this.handleError('detectEmotion', error, { textLength: text?.length });
      return this.createNeutralResult();
    }
  }
  
  /**
   * Initializes emotion detection patterns
   * 
   * @returns Map of emotion patterns
   */
  private initializeEmotionPatterns(): Map<string, RegExp[]> {
    const patterns = new Map<string, RegExp[]>();
    
    // Joy patterns
    patterns.set('joy', [
      /\b(?:happy|happiness|joy|joyful|joyous|delighted|delight|pleased|glad|content|satisfied|ecstatic|elated|thrilled|rejoice|jubilant)\b/i,
      /\b(?:enjoying|enjoy|celebrates|celebrate|celebration|congratulations|congrats|wonderful|amazing|fantastic|excellent|terrific)\b/i,
      /\b(?:pleased|pleasing|pleasure|cheerful|cheery|merry|jolly|jovial|gleeful|carefree|blessed|blissful|delighted)\b/i,
      /\b(?:😀|😁|😃|😄|😊|☺️|🙂|😌|😍|🥰|😘|🤗|🤩|😎)\b/
    ]);
    
    // Sadness patterns
    patterns.set('sadness', [
      /\b(?:sad|sadness|unhappy|sorrowful|depressed|depression|miserable|gloomy|downcast|downhearted|despondent|disheartened)\b/i,
      /\b(?:heartbroken|grief|grieving|mourn|mourning|woe|woeful|melancholy|somber|dismal|bleak|wretched|forlorn)\b/i,
      /\b(?:disappointed|disappointment|regretful|regret|sorry|sorrow|tearful|cry|crying|sobbing|weeping|lamenting|lament)\b/i,
      /\b(?:😔|😢|😭|😿|☹️|🙁|😕|😰|😥|😪|😓|😩|😫|🥺)\b/
    ]);
    
    // Anger patterns
    patterns.set('anger', [
      /\b(?:angry|anger|mad|furious|fury|outraged|outrage|livid|enraged|infuriated|irritated|irritation|annoyed|annoyance)\b/i,
      /\b(?:frustrated|frustration|exasperated|indignant|resentful|bitter|hostile|antagonistic|offended|hateful|hate)\b/i,
      /\b(?:pissed|seething|fuming|disgruntled|ticked|irate|incensed|inflamed|provoked|resentment|animosity|wrath)\b/i,
      /\b(?:😠|😡|😤|👿|💢|🗯️|💥|🤬|😒|🙄|🤯)\b/
    ]);
    
    // Fear patterns
    patterns.set('fear', [
      /\b(?:afraid|fear|scared|frightened|terrified|alarmed|panicked|panic|anxious|anxiety|nervous|worried|dread)\b/i,
      /\b(?:horror|horrified|terror|petrified|apprehensive|uneasy|distressed|distress|disturbed|perturbed|phobia)\b/i,
      /\b(?:intimidated|intimidating|threatening|menacing|scary|shaken|startled|spooked|aghast|trembling|quaking)\b/i,
      /\b(?:😨|😧|😱|😰|😥|😳|😶|🤭|😬|🙀|😖|😣|😯|🥶)\b/
    ]);
    
    // Surprise patterns
    patterns.set('surprise', [
      /\b(?:surprised|surprise|astonished|astonishment|amazed|amazement|shocked|shock|startled|unexpected|wonder)\b/i,
      /\b(?:stunned|astounded|dumbfounded|speechless|flabbergasted|staggered|bewildered|awestruck|incredulous)\b/i,
      /\b(?:unbelievable|incredible|extraordinary|remarkable|striking|stunning|dazzling|overwhelming|breathtaking)\b/i,
      /\b(?:😲|😮|😯|😦|😧|😵|🤯|😱|😳|😵‍💫|🤨|🧐)\b/
    ]);
    
    // Disgust patterns
    patterns.set('disgust', [
      /\b(?:disgust|disgusted|revolting|revolted|repulsed|repulsive|nauseating|nauseous|sickened|gross|vile|foul)\b/i,
      /\b(?:repugnant|repugnance|abhorrent|abhor|loathsome|loathe|detestable|detest|odious|offensive|repellent)\b/i,
      /\b(?:nasty|distasteful|unsavory|unpalatable|objectionable|off-putting|sickening|queasy|yuck|eww|ugh|yucky)\b/i,
      /\b(?:🤢|🤮|😖|😫|🥴|😷|👹|👺)\b/
    ]);
    
    // Anticipation patterns
    patterns.set('anticipation', [
      /\b(?:anticipate|anticipation|expect|expected|expectation|await|awaiting|looking forward|eagerly|eager)\b/i,
      /\b(?:excited|excitement|thrilled|hopeful|hope|hoping|optimistic|optimism|keen|enthusiastic|enthusiasm)\b/i,
      /\b(?:predict|predicted|prediction|foresee|foreseeing|envision|envisioning|prospect|forecast|upcoming)\b/i,
      /\b(?:🤔|🧐|👀|👁️|⏳|⌛|⏰|📆|🔮|✨|💫|💭|🙏)\b/
    ]);
    
    // Trust patterns
    patterns.set('trust', [
      /\b(?:trust|trusting|trusted|reliable|reliability|dependable|faithful|loyal|loyalty|honest|honesty|integrity)\b/i,
      /\b(?:believe|belief|confidence|confident|sure|convinced|credible|credibility|authentic|authenticity|genuine)\b/i,
      /\b(?:truthful|truthfulness|trustworthy|trustworthiness|honor|honorable|sincere|sincerity|commitment|devoted)\b/i,
      /\b(?:🤝|🙌|👍|👌|💯|✅|☑️|✔️|🔒|🛡️|🔐|🗝️|🔑)\b/
    ]);
    
    // Empathy patterns
    patterns.set('empathy', [
      /\b(?:empathy|empathize|empathise|compassion|compassionate|understand|understanding|sympathy|sympathetic)\b/i,
      /\b(?:feel for|care for|concern|concerned|sensitive|sensitivity|thoughtful|considerate|kind|kindness|warmth)\b/i,
      /\b(?:supportive|support|relate|relating|relatable|connection|connected|resonance|resonate|solidarity|insight)\b/i,
      /\b(?:❤️|🫂|🤲|🤝|🤗|💞|💓|💗|💕|💖|💘|💝|🫀|☮️)\b/
    ]);
    
    // Gratitude patterns
    patterns.set('gratitude', [
      /\b(?:grateful|gratitude|thankful|thanks|thank you|appreciate|appreciation|indebted|blessed|blessing|fortune)\b/i,
      /\b(?:privileged|honored|honour|honoured|lucky|fortunate|grace|gracious|acknowledging|acknowledgment|recognition)\b/i,
      /\b(?:content|contentment|fulfilled|fulfillment|satisfied|satisfaction|pleased|humbled|moved|touched|overwhelmed)\b/i,
      /\b(?:🙏|🙌|🤲|✨|💫|✌️|👏|💐|🎊|🎉|🏆|🥇|🌟|💎)\b/
    ]);
    
    // Disappointment patterns
    patterns.set('disappointment', [
      /\b(?:disappointed|disappointment|letdown|disheartened|disillusion|disillusioned|disillusionment|disenchanted)\b/i,
      /\b(?:dissatisfied|dissatisfaction|displeased|dismayed|discontented|discontent|unfulfilled|unfulfilling)\b/i,
      /\b(?:fallen short|let down|not up to|fail to|failed to|fails to|failing to|missed|miss|expected more|underwhelming)\b/i,
      /\b(?:😞|😔|😒|😕|🙁|☹️|😟|😢|😥|💔|🫥|🙃|⬇️|📉)\b/
    ]);
    
    // Excitement patterns
    patterns.set('excitement', [
      /\b(?:excited|excitement|thrilled|exhilarated|exhilaration|enthusiastic|enthusiasm|eager|pumped|psyched)\b/i,
      /\b(?:animated|energetic|lively|vibrant|dynamic|stimulated|invigorated|inspired|inspiring|inspiration|buzzing)\b/i,
      /\b(?:fired up|charged up|amped up|stoked|juiced|jazzed|hyped|electrified|adrenalized|passionate|fervent)\b/i,
      /\b(?:🤩|🔥|⚡|💥|✨|🎉|🎊|🥳|🤪|😝|😜|💃|🕺|👯)\b/
    ]);
    
    // Neutral patterns - used as fallback with lower confidence
    patterns.set('neutral', [
      /\b(?:okay|ok|fine|alright|so-so|average|moderate|fair|decent|reasonable|tolerable|acceptable|adequate)\b/i,
      /\b(?:neutral|balanced|composed|collected|calm|level-headed|steady|still|quiet|tranquil|unemotional)\b/i,
      /\b(?:indifferent|dispassionate|detached|reserved|restrained|controlled|composed|impartial|objective|clinical)\b/i,
      /\b(?:😐|😑|😶|🙂|😌|😏|🤐|😶‍🌫️|🥱|💤|⚖️|🧘|⏹️|⬜)\b/
    ]);
    
    return patterns;
  }
  
  /**
   * Normalizes text for analysis
   * 
   * @param text - Text to normalize
   * @returns Normalized text
   */
  private normalizeText(text: string): string {
    return text.toLowerCase().trim();
  }
  
  /**
   * Calculates emotion score based on patterns
   * 
   * @param text - Normalized text
   * @param patterns - Patterns to match
   * @returns Emotion score
   */
  private calculateEmotionScore(text: string, patterns: RegExp[]): number {
    let score = 0;
    const words = text.split(/\s+/);
    
    // Check each pattern
    patterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      score += matches.length * 0.2;
    });
    
    // Normalize score to 0-1 range
    return Math.min(1, score);
  }
  
  /**
   * Checks if text contains negation
   * 
   * @param text - Normalized text
   * @returns Whether text contains negation
   */
  private containsNegation(text: string): boolean {
    return this.negationWords.some(word => {
      // Check for word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(text);
    });
  }
  
  /**
   * Calculates intensity modifier based on intensifiers and diminishers
   * 
   * @param text - Normalized text
   * @returns Intensity modifier (-0.5 to 0.5)
   */
  private calculateIntensityModifier(text: string): number {
    let modifier = 0;
    
    // Count intensifiers
    this.intensifierWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex) || [];
      modifier += matches.length * 0.1;
    });
    
    // Count diminishers
    this.diminisherWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex) || [];
      modifier -= matches.length * 0.1;
    });
    
    // Limit modifier to range -0.5 to 0.5
    return Math.max(-0.5, Math.min(0.5, modifier));
  }
  
  /**
   * Creates a neutral emotion result
   * 
   * @returns Neutral emotion analysis result
   */
  private createNeutralResult(): EmotionAnalysisResult {
    const emotions: Record<string, number> = {};
    
    // Initialize all emotions with 0 except neutral
    this.primaryEmotions.forEach(emotion => {
      emotions[emotion] = emotion === 'neutral' ? 1 : 0;
    });
    
    return {
      primaryEmotion: 'neutral',
      intensity: 0.5,
      emotions
    };
  }
  
  /**
   * Error handling with context
   */
  private handleError(methodName: string, error: unknown, context: Record<string, any> = {}): void {
    this.logger.error(`Error in NLPEmotionDetector.${methodName}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context
    });
    
    // Emit error event if event bus is available
    if (this.eventBus) {
      this.eventBus.emit('nlpEmotionDetector.error', {
        method: methodName,
        error: error instanceof Error ? error.message : String(error),
        context
      });
    }
  }
}

/**
 * Interface for emotion analysis result
 */
export interface EmotionAnalysisResult {
  primaryEmotion: string;
  intensity: number;
  emotions: Record<string, number>;
} 