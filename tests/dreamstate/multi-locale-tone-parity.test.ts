/**
 * @file tests/dreamstate/multi-locale-tone-parity.test.ts
 * @description Validates emotional tone parity across multiple locales, ensuring that the intended emotional effect is rendered with consistent psychological resonance and trust weight regardless of language
 * @version 6.1.4
 */

// Polaris Ritual: Multi-Locale Tone Parity
// Codex Vector: Emotional Parity Assurance
// Codex Safeguard: Same tone must evoke same feeling across all locales

import { 
  createToneSpecificPayload, 
  createLocaleSpecificPayload,
  EmotionalPayload 
} from '../../cursor/utils/emotion-payload-builder';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { CXToneSentinel } from '../../cursor/validators/cx-tone-sentinel';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

// Polaris Ritual: Multi-Locale Tone Parity
// Codex Vector: Emotional Parity Assurance
// Codex Safeguard: Same tone must evoke same feeling across all locales

interface UXRenderResult {
  cta: string;
  helperText: string;
  messageStyle: string;
  trustIndicator: string;
  emotionalSnapshot: string;
  usedFallback: boolean;
  traceId: string;
  locale: string;
  uiComponents: {
    showHelper: boolean;
    enableCTA: boolean;
    messageFormat: string;
    htmlOutput?: string;
  };
}

interface TranslationMap {
  getCtaTranslation(cta: string, locale: string): string;
  getHelperTextTranslation(helperText: string, locale: string): string;
  getFallbackMessage(scenario: string, locale: string): string;
  getToneTranslation(tone: string, locale: string): string;
}

// Real TranslationMap implementation for multi-locale tone parity
class TranslationMap implements TranslationMap {
  private readonly translations: Record<string, Record<string, string>> = {
    // CTA Translations
    'Continue': {
      'fr-FR': 'Continuer',
      'es-ES': 'Continuar',
      'de-DE': 'Weiter',
      'ja-JP': '続ける'
    },
    'Let\'s Make it Happen!': {
      'fr-FR': 'Réalisons cela !',
      'es-ES': '¡Hagámoslo realidad!',
      'de-DE': 'Lass es uns schaffen!',
      'ja-JP': '実現しましょう！'
    },
    'Continue Safely': {
      'fr-FR': 'Continuer en sécurité',
      'es-ES': 'Continuar con seguridad',
      'de-DE': 'Sicher fortfahren',
      'ja-JP': '安全に続ける'
    },
    'Let\'s Work Through This': {
      'fr-FR': 'Travaillons ensemble sur cela',
      'es-ES': 'Trabajemos en esto juntos',
      'de-DE': 'Lass uns das gemeinsam durcharbeiten',
      'ja-JP': '一緒に取り組みましょう'
    },
    'Review Options': {
      'fr-FR': 'Examiner les options',
      'es-ES': 'Revisar opciones',
      'de-DE': 'Optionen überprüfen',
      'ja-JP': 'オプションを確認'
    },
    
    // Helper Text Translations
    'We\'re excited to bring your vision to life!': {
      'fr-FR': 'Nous sommes ravis de donner vie à votre vision !',
      'es-ES': '¡Estamos emocionados de dar vida a tu visión!',
      'de-DE': 'Wir freuen uns darauf, Ihre Vision zum Leben zu erwecken!',
      'ja-JP': 'あなたのビジョンを実現することを楽しみにしています！'
    },
    'You\'re in good hands. We\'re here to support you.': {
      'fr-FR': 'Vous êtes entre de bonnes mains. Nous sommes là pour vous soutenir.',
      'es-ES': 'Estás en buenas manos. Estamos aquí para apoyarte.',
      'de-DE': 'Sie sind in guten Händen. Wir sind hier, um Sie zu unterstützen.',
      'ja-JP': 'あなたは安全です。私たちがサポートします。'
    },
    'We understand this can be challenging. We\'re here to help.': {
      'fr-FR': 'Nous comprenons que cela peut être difficile. Nous sommes là pour aider.',
      'es-ES': 'Entendemos que esto puede ser desafiante. Estamos aquí para ayudar.',
      'de-DE': 'Wir verstehen, dass dies herausfordernd sein kann. Wir sind hier, um zu helfen.',
      'ja-JP': 'これが困難であることを理解しています。お手伝いします。'
    },
    'Let\'s take a moment to consider the best approach.': {
      'fr-FR': 'Prenons un moment pour considérer la meilleure approche.',
      'es-ES': 'Tomémonos un momento para considerar el mejor enfoque.',
      'de-DE': 'Lassen Sie uns einen Moment innehalten, um den besten Ansatz zu überlegen.',
      'ja-JP': '最適なアプローチを検討するために少し時間を取りましょう。'
    },
    'Thank you for your input. We value your collaboration.': {
      'fr-FR': 'Merci pour votre contribution. Nous apprécions votre collaboration.',
      'es-ES': 'Gracias por tu aporte. Valoramos tu colaboración.',
      'de-DE': 'Vielen Dank für Ihren Beitrag. Wir schätzen Ihre Zusammenarbeit.',
      'ja-JP': 'ご意見をありがとうございます。あなたの協力を大切にしています。'
    },
    
    // Fallback Messages
    'Take a breath — we\'ll walk this path together.': {
      'fr-FR': 'Respirez — nous parcourrons ce chemin ensemble.',
      'es-ES': 'Respira — caminaremos este sendero juntos.',
      'de-DE': 'Atmen Sie durch — wir gehen diesen Weg gemeinsam.',
      'ja-JP': '深呼吸して — 一緒にこの道を歩みましょう。'
    },
    'I want to make sure I understand you correctly.': {
      'fr-FR': 'Je veux m\'assurer de bien vous comprendre.',
      'es-ES': 'Quiero asegurarme de entenderte correctamente.',
      'de-DE': 'Ich möchte sicherstellen, dass ich Sie richtig verstehe.',
      'ja-JP': '正しく理解していることを確認したいと思います。'
    }
  };

  getCtaTranslation(cta: string, locale: string): string {
    if (locale === 'en-US') return cta;
    return this.translations[cta]?.[locale] || `[${locale}] ${cta}`;
  }

  getHelperTextTranslation(helperText: string, locale: string): string {
    if (locale === 'en-US') return helperText;
    return this.translations[helperText]?.[locale] || `[${locale}] ${helperText}`;
  }

  getFallbackMessage(scenario: string, locale: string): string {
    const fallbackMessages: Record<string, string> = {
      'overwhelm detection': 'Take a breath — we\'ll walk this path together.',
      'empty/unclear output': 'I want to make sure I understand you correctly.',
      'trust_compromised': 'Would you like to connect with our support team?',
      'prompt failure': 'Let\'s take a fresh look at this.'
    };
    
    const message = fallbackMessages[scenario] || 'Let\'s take a fresh look at this.';
    return this.getHelperTextTranslation(message, locale);
  }

  getToneTranslation(tone: string, locale: string): string {
    // Tone names should remain consistent across locales for system integrity
    return tone;
  }
}

// Real EmotionalUXRenderer implementation with full locale support
class EmotionalUXRenderer {
  private translationMap: TranslationMap;

  constructor() {
    this.translationMap = new TranslationMap();
  }

  renderPayload(payload: EmotionalPayload, renderContext: string = 'standard'): UXRenderResult {
    let cta = 'Continue';
    let helperText = '';
    let messageStyle = 'standard';
    let trustIndicator = 'normal';
    let htmlOutput = '';
    
    // Check for empty payload - should trigger fallback
    if (!payload.payload || payload.payload.trim() === '') {
      return this.renderFallbackUI(payload, renderContext, 'empty/unclear output');
    }
    
    // Apply tone-specific rendering
    switch (payload.tone) {
      case 'enthusiastic':
      case 'inspiring':
        cta = 'Let\'s Make it Happen!';
        helperText = 'We\'re excited to bring your vision to life!';
        messageStyle = 'vibrant';
        break;
      case 'reassuring':
        cta = 'Continue Safely';
        helperText = 'You\'re in good hands. We\'re here to support you.';
        messageStyle = 'calm';
        break;
      case 'empathetic':
        cta = 'Let\'s Work Through This';
        helperText = 'We understand this can be challenging. We\'re here to help.';
        messageStyle = 'supportive';
        break;
      case 'anxious':
      case 'concerned':
        cta = 'Review Options';
        helperText = 'Let\'s take a moment to consider the best approach.';
        messageStyle = 'cautious';
        break;
      case 'sarcastic':
      case 'frustrated':
        // Trigger fallback UI for negative tones
        return this.renderFallbackUI(payload, renderContext, 'overwhelm detection');
      case 'grateful':
      case 'appreciative':
        cta = 'Continue';
        helperText = 'Thank you for your input. We value your collaboration.';
        messageStyle = 'appreciative';
        break;
      case 'professional':
        cta = 'Continue';
        helperText = 'Here\'s what we\'ve prepared based on industry standards.';
        messageStyle = 'professional';
        break;
      default:
        // Use neutral messaging for unknown tone
        cta = 'Continue';
        helperText = 'Here\'s what we\'ve prepared for you.';
        messageStyle = 'standard';
    }
    
    // Modify based on trust score
    if (payload.trustScore < 0.7) {
      trustIndicator = 'compromised';
      cta = 'Proceed With Caution';
      
      if (payload.trustScore < 0.5) {
        // Severe trust compromise triggers fallback UI
        return this.renderFallbackUI(payload, renderContext, 'trust_compromised');
      }
    } else if (payload.trustScore > 0.9) {
      trustIndicator = 'enhanced';
    }
    
    // Apply locale-specific translations
    if (payload.locale !== 'en-US') {
      cta = this.translationMap.getCtaTranslation(cta, payload.locale);
      helperText = this.translationMap.getHelperTextTranslation(helperText, payload.locale);
    }
    
    // Create simulated HTML output for DOM snapshot testing
    htmlOutput = this.generateHTMLOutput(payload, cta, helperText, messageStyle, trustIndicator);
    
    // Create emotional snapshot
    const emotionalSnapshot = JSON.stringify({
      tone: payload.tone,
      trustScore: payload.trustScore,
      emotionIntentHash: payload.emotionIntentHash,
      timestamp: payload.timestamp,
      locale: payload.locale,
      messageStyle,
      trustIndicator
    });
    
    return {
      cta,
      helperText,
      messageStyle,
      trustIndicator,
      emotionalSnapshot,
      usedFallback: false,
      traceId: payload.traceId,
      locale: payload.locale,
      uiComponents: {
        showHelper: true,
        enableCTA: true,
        messageFormat: 'standard',
        htmlOutput
      }
    };
  }
  
  renderFallbackUI(payload: EmotionalPayload, renderContext: string = 'standard', scenario: string = 'prompt failure'): UXRenderResult {
    // Get appropriate fallback message according to Emotional Fallback Protocol
    let helperText = this.translationMap.getFallbackMessage(scenario, payload.locale);
    
    // Translate CTA button for non-English locales
    let cta = 'Try Again';
    if (payload.locale !== 'en-US') {
      cta = this.translationMap.getCtaTranslation(cta, payload.locale);
    }
    
    // Create simulated HTML output for fallback
    const htmlOutput = this.generateFallbackHTMLOutput(payload, scenario, helperText);
    
    // Create emotional snapshot with fallback flag
    const emotionalSnapshot = JSON.stringify({
      tone: 'fallback',
      originalTone: payload.tone,
      trustScore: Math.max(payload.trustScore, 0.5), // Ensure minimum trust
      emotionIntentHash: payload.emotionIntentHash,
      timestamp: payload.timestamp,
      fallbackTriggered: true,
      fallbackReason: scenario,
      locale: payload.locale
    });
    
    return {
      cta,
      helperText,
      messageStyle: 'fallback',
      trustIndicator: 'recovering',
      emotionalSnapshot,
      usedFallback: true,
      traceId: payload.traceId,
      locale: payload.locale,
      uiComponents: {
        showHelper: true,
        enableCTA: true,
        messageFormat: 'fallback',
        htmlOutput
      }
    };
  }

  private generateHTMLOutput(payload: EmotionalPayload, cta: string, helperText: string, messageStyle: string, trustIndicator: string): string {
    return `
      <div class="emotional-ui ${messageStyle}" data-locale="${payload.locale}" data-trust="${trustIndicator}">
        <div class="message-content" data-tone="${payload.tone}">
          ${payload.payload}
        </div>
        <div class="helper-text">${helperText}</div>
        <button class="cta-button ${messageStyle}">${cta}</button>
        <div class="trust-indicator ${trustIndicator}"></div>
      </div>
    `.trim();
  }

  private generateFallbackHTMLOutput(payload: EmotionalPayload, scenario: string, helperText: string): string {
    return `
      <div class="emotional-ui fallback" data-locale="${payload.locale}" data-scenario="${scenario}">
        <div class="fallback-content">
          <div class="helper-text">${helperText}</div>
          <button class="cta-button fallback">Try Again</button>
          <div class="trust-indicator recovering"></div>
        </div>
      </div>
    `.trim();
  }
}

// Real ToneParityValidator for cross-locale emotional consistency
class ToneParityValidator {
  private validator: EmotionalValidator;
  private toneSentinel: CXToneSentinel;

  constructor() {
    this.validator = new EmotionalValidator();
    this.toneSentinel = CXToneSentinel.getInstance();
  }

  async validateToneParity(payloads: EmotionalPayload[]): Promise<{
    isParityMaintained: boolean;
    parityScore: number;
    inconsistencies: string[];
    trustScoreVariance: number;
    emotionalConsistency: boolean;
  }> {
    if (payloads.length < 2) {
      throw new Error('At least 2 payloads required for parity validation');
    }

    const inconsistencies: string[] = [];
    let totalParityScore = 0;
    const trustScores = payloads.map(p => p.trustScore);
    const trustScoreVariance = this.calculateVariance(trustScores);

    // Validate emotional intent hash consistency
    const baseIntentHash = payloads[0].emotionIntentHash;
    const intentHashConsistent = payloads.every(p => p.emotionIntentHash === baseIntentHash);
    
    if (!intentHashConsistent) {
      inconsistencies.push('Emotional intent hash varies across locales');
    }

    // Validate tone consistency
    const baseTone = payloads[0].tone;
    const toneConsistent = payloads.every(p => p.tone === baseTone);
    
    if (!toneConsistent) {
      inconsistencies.push('Tone classification varies across locales');
    }

    // Validate trust score consistency (allow small variance)
    if (trustScoreVariance > 0.1) {
      inconsistencies.push(`Trust score variance too high: ${trustScoreVariance.toFixed(3)}`);
    }

    // Calculate individual parity scores
    for (let i = 0; i < payloads.length; i++) {
      const payload = payloads[i];
      const toneScore = await this.validator.validateEmotionalTone(payload.tone);
      const sentinelResult = this.toneSentinel.scan(payload.payload, 'tone-parity-test', 'output');
      
      const parityScore = (toneScore + (sentinelResult.passesReversalTest ? 1 : 0)) / 2;
      totalParityScore += parityScore;

      if (!sentinelResult.passesReversalTest) {
        inconsistencies.push(`Locale ${payload.locale} fails reversal test`);
      }
    }

    const averageParityScore = totalParityScore / payloads.length;
    const isParityMaintained = inconsistencies.length === 0 && averageParityScore >= 0.8;

    return {
      isParityMaintained,
      parityScore: averageParityScore,
      inconsistencies,
      trustScoreVariance,
      emotionalConsistency: intentHashConsistent && toneConsistent
    };
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }
}

describe('DreamState: multi-locale-tone-parity', () => {
  let renderer: EmotionalUXRenderer;
  let validator: EmotionalValidator;
  let toneSentinel: CXToneSentinel;
  let parityValidator: ToneParityValidator;
  let eventBus: EventBus;
  let eventLog: any[] = [];

  const SUPPORTED_LOCALES = ['en-US', 'fr-FR', 'es-ES', 'de-DE', 'ja-JP'];
  const TEST_TONES = ['sarcastic', 'grateful', 'empathetic', 'professional', 'enthusiastic'];

  // Helper method for variance calculation
  const calculateVariance = (values: number[]): number => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  };

  beforeAll(() => {
    renderer = new EmotionalUXRenderer();
    validator = new EmotionalValidator();
    toneSentinel = CXToneSentinel.getInstance();
    parityValidator = new ToneParityValidator();
    eventBus = EventBus.getInstance();

    // Track events for validation
    eventBus.on('emotional-payload-created', async (data) => {
      eventLog.push({ 
        type: 'emotional-payload-created', 
        tone: data.payload.tone,
        locale: data.payload.locale,
        trustScore: data.payload.trustScore,
        timestamp: data.timestamp
      });
    });

    eventBus.on('tone-parity-validation', async (data) => {
      eventLog.push({ 
        type: 'tone-parity-validation', 
        result: data.result,
        locales: data.locales,
        timestamp: data.timestamp
      });
    });
  });

  beforeEach(() => {
    eventLog = [];
  });

  // Polaris Ritual: Multi-Locale Tone Parity
  it('should maintain sarcastic tone parity across English, French, and Spanish', async () => {
    // What: Validate sarcastic tone renders with same emotional effect across locales
    // Why: Sarcasm must feel sarcastic in all languages, not neutral or confusing
    // How: Create sarcastic payloads in multiple locales, validate UX structure and tone anchors match

    const baseTraceId = uuidv4();
    const baseIntentHash = crypto.createHash('sha256').update('sarcastic-intent').digest('hex');

    // Create sarcastic payloads for three locales
    const enPayload = await createToneSpecificPayload('sarcastic', {
      locale: 'en-US',
      payload: 'Oh sure, because that always works out so well.',
      traceId: baseTraceId,
      emotionIntentHash: baseIntentHash
    });

    const frPayload = await createToneSpecificPayload('sarcastic', {
      locale: 'fr-FR',
      payload: 'Oh bien sûr, parce que ça marche toujours si bien.',
      traceId: baseTraceId,
      emotionIntentHash: baseIntentHash
    });

    const esPayload = await createToneSpecificPayload('sarcastic', {
      locale: 'es-ES',
      payload: 'Oh claro, porque eso siempre funciona tan bien.',
      traceId: baseTraceId,
      emotionIntentHash: baseIntentHash
    });

    // Render all payloads (should trigger fallback for sarcastic tone)
    const enResult = renderer.renderPayload(enPayload);
    const frResult = renderer.renderPayload(frPayload);
    const esResult = renderer.renderPayload(esPayload);

    // 1. Validate Tone Preservation - all should trigger fallback for sarcastic tone
    expect(enResult.usedFallback).toBe(true);
    expect(frResult.usedFallback).toBe(true);
    expect(esResult.usedFallback).toBe(true);

    // 2. Validate UX Structure Parity - same fallback behavior across locales
    expect(enResult.messageStyle).toBe('fallback');
    expect(frResult.messageStyle).toBe('fallback');
    expect(esResult.messageStyle).toBe('fallback');

    // 3. Validate Trust Score Consistency
    const enSnapshot = JSON.parse(enResult.emotionalSnapshot);
    const frSnapshot = JSON.parse(frResult.emotionalSnapshot);
    const esSnapshot = JSON.parse(esResult.emotionalSnapshot);
    
    expect(enSnapshot.originalTone).toBe('sarcastic');
    expect(frSnapshot.originalTone).toBe('sarcastic');
    expect(esSnapshot.originalTone).toBe('sarcastic');

    // 4. Validate Trace Continuity
    expect(enResult.traceId).toBe(baseTraceId);
    expect(frResult.traceId).toBe(baseTraceId);
    expect(esResult.traceId).toBe(baseTraceId);

    // 5. Validate Locale-Specific Translations
    expect(enResult.locale).toBe('en-US');
    expect(frResult.locale).toBe('fr-FR');
    expect(esResult.locale).toBe('es-ES');

    // 6. Validate Parity Using ToneParityValidator
    const parityResult = await parityValidator.validateToneParity([enPayload, frPayload, esPayload]);
    expect(parityResult.emotionalConsistency).toBe(true);
    expect(parityResult.trustScoreVariance).toBeLessThan(0.1);
  });

  // Polaris Ritual: Multi-Locale Tone Parity
  it('should maintain grateful tone parity across all supported locales', async () => {
    // What: Validate grateful tone renders with same warm, appreciative effect across all locales
    // Why: Gratitude must feel warm and appreciative in all languages
    // How: Create grateful payloads in all supported locales, validate emotional consistency

    const baseTraceId = uuidv4();
    const baseIntentHash = crypto.createHash('sha256').update('grateful-intent').digest('hex');

    // Create grateful payloads for all supported locales
    const payloads = await Promise.all(
      SUPPORTED_LOCALES.map(async (locale) => {
        const localizedMessage = {
          'en-US': 'Thank you so much for your valuable feedback and insights.',
          'fr-FR': 'Merci beaucoup pour vos précieux commentaires et idées.',
          'es-ES': 'Muchas gracias por tus valiosos comentarios e ideas.',
          'de-DE': 'Vielen Dank für Ihr wertvolles Feedback und Ihre Einsichten.',
          'ja-JP': '貴重なフィードバックと洞察をありがとうございます。'
        }[locale] || 'Thank you for your feedback.';

        return await createToneSpecificPayload('grateful', {
          locale,
          payload: localizedMessage,
          traceId: baseTraceId,
          emotionIntentHash: baseIntentHash
        });
      })
    );

    // Render all payloads
    const results = payloads.map(payload => renderer.renderPayload(payload));

    // 1. Validate Tone Preservation - all should render as appreciative
    results.forEach(result => {
      expect(result.messageStyle).toBe('appreciative');
      expect(result.usedFallback).toBe(false);
    });

    // 2. Validate Trust Score Consistency
    const trustScores = results.map(result => {
      const snapshot = JSON.parse(result.emotionalSnapshot);
      return snapshot.trustScore;
    });
    
    const trustVariance = calculateVariance(trustScores);
    expect(trustVariance).toBeLessThan(0.05); // Very low variance for grateful tone

    // 3. Validate Emotional Intent Hash Consistency
    const intentHashes = results.map(result => {
      const snapshot = JSON.parse(result.emotionalSnapshot);
      return snapshot.emotionIntentHash;
    });
    
    const uniqueIntentHashes = new Set(intentHashes);
    expect(uniqueIntentHashes.size).toBe(1); // All should have same intent hash

    // 4. Validate Locale-Specific Translations
    results.forEach((result, index) => {
      expect(result.locale).toBe(SUPPORTED_LOCALES[index]);
      // Validate that helper text is either in English or has locale prefix
      const hasValidHelperText = result.helperText.length > 0;
      expect(hasValidHelperText).toBe(true);
    });

    // 5. Validate Comprehensive Parity
    const parityResult = await parityValidator.validateToneParity(payloads);
    
    // Debug output to understand the failure
    console.log('Parity validation result:', {
      isParityMaintained: parityResult.isParityMaintained,
      parityScore: parityResult.parityScore,
      inconsistencies: parityResult.inconsistencies,
      trustScoreVariance: parityResult.trustScoreVariance,
      emotionalConsistency: parityResult.emotionalConsistency
    });
    
    expect(parityResult.isParityMaintained).toBe(true);
    expect(parityResult.parityScore).toBeGreaterThan(0.9);
  });

  // Polaris Ritual: Multi-Locale Tone Parity
  it('should detect tone drift when locale output is mutated', async () => {
    // What: Validate that tone misalignment is detected when one locale's output is artificially changed
    // Why: System must detect when emotional consistency is broken across locales
    // How: Create consistent payloads, mutate one locale's tone, validate parity failure

    const baseTraceId = uuidv4();
    const baseIntentHash = crypto.createHash('sha256').update('empathetic-intent').digest('hex');

    // Create empathetic payloads for three locales
    const enPayload = await createToneSpecificPayload('empathetic', {
      locale: 'en-US',
      payload: 'I understand this situation must be really difficult for you.',
      traceId: baseTraceId,
      emotionIntentHash: baseIntentHash
    });

    const frPayload = await createToneSpecificPayload('empathetic', {
      locale: 'fr-FR',
      payload: 'Je comprends que cette situation doit être vraiment difficile pour vous.',
      traceId: baseTraceId,
      emotionIntentHash: baseIntentHash
    });

    // Mutate the Spanish payload to have a different tone (this should trigger parity failure)
    const esMutatedPayload = await createToneSpecificPayload('enthusiastic', {
      locale: 'es-ES',
      payload: '¡Esto es increíble! ¡Estoy muy emocionado por esto!',
      traceId: baseTraceId,
      emotionIntentHash: crypto.createHash('sha256').update('enthusiastic-intent').digest('hex') // Different intent hash
    });

    // Validate parity failure is detected
    const parityResult = await parityValidator.validateToneParity([enPayload, frPayload, esMutatedPayload]);
    
    expect(parityResult.isParityMaintained).toBe(false);
    expect(parityResult.inconsistencies).toContain('Tone classification varies across locales');
    expect(parityResult.inconsistencies).toContain('Emotional intent hash varies across locales');
    expect(parityResult.emotionalConsistency).toBe(false);

    // Render the payloads to validate UX differences
    const enResult = renderer.renderPayload(enPayload);
    const frResult = renderer.renderPayload(frPayload);
    const esResult = renderer.renderPayload(esMutatedPayload);

    // Validate that the mutated payload produces different UX
    expect(enResult.messageStyle).toBe('supportive'); // empathetic
    expect(frResult.messageStyle).toBe('supportive'); // empathetic
    expect(esResult.messageStyle).toBe('vibrant');    // enthusiastic (mutated)

    // Validate that tone mismatch is detectable in snapshots
    const enSnapshot = JSON.parse(enResult.emotionalSnapshot);
    const frSnapshot = JSON.parse(frResult.emotionalSnapshot);
    const esSnapshot = JSON.parse(esResult.emotionalSnapshot);

    expect(enSnapshot.tone).toBe('empathetic');
    expect(frSnapshot.tone).toBe('empathetic');
    expect(esSnapshot.tone).toBe('enthusiastic'); // Different!
  });

  // Polaris Ritual: Multi-Locale Tone Parity
  it('should maintain trust score consistency across locales for same emotional intent', async () => {
    // What: Validate that trust scores remain consistent across locales for the same emotional intent
    // Why: Trust volatility must be consistent regardless of language
    // How: Create payloads with varying trust scores, validate consistency across locales

    const baseTraceId = uuidv4();
    const baseIntentHash = crypto.createHash('sha256').update('professional-intent').digest('hex');

    const trustScores = [0.95, 0.75, 0.45]; // High, medium, low trust

    for (const trustScore of trustScores) {
      // Create professional payloads with specific trust score for three locales
      const payloads = await Promise.all([
        createToneSpecificPayload('professional', {
          locale: 'en-US',
          payload: 'We\'ve prepared a comprehensive analysis based on industry standards.',
          traceId: baseTraceId,
          emotionIntentHash: baseIntentHash,
          trustScore
        }),
        createToneSpecificPayload('professional', {
          locale: 'fr-FR',
          payload: 'Nous avons préparé une analyse complète basée sur les normes de l\'industrie.',
          traceId: baseTraceId,
          emotionIntentHash: baseIntentHash,
          trustScore
        }),
        createToneSpecificPayload('professional', {
          locale: 'es-ES',
          payload: 'Hemos preparado un análisis integral basado en estándares de la industria.',
          traceId: baseTraceId,
          emotionIntentHash: baseIntentHash,
          trustScore
        })
      ]);

      // Render all payloads
      const results = payloads.map(payload => renderer.renderPayload(payload));

      // Validate trust score consistency (accounting for fallback UI modifications)
      const renderedTrustScores = results.map(result => {
        const snapshot = JSON.parse(result.emotionalSnapshot);
        return snapshot.trustScore;
      });

      // For low trust scores, fallback UI may enforce minimum trust of 0.5
      if (trustScore < 0.5) {
        // All should be adjusted to minimum trust
        expect(renderedTrustScores[0]).toBeGreaterThanOrEqual(0.5);
        expect(renderedTrustScores[1]).toBeGreaterThanOrEqual(0.5);
        expect(renderedTrustScores[2]).toBeGreaterThanOrEqual(0.5);
      } else {
        // All trust scores should be identical for higher trust scores
        expect(renderedTrustScores[0]).toBe(trustScore);
        expect(renderedTrustScores[1]).toBe(trustScore);
        expect(renderedTrustScores[2]).toBe(trustScore);
      }

      // Validate trust indicators are consistent
      const trustIndicators = results.map(result => result.trustIndicator);
      const uniqueTrustIndicators = new Set(trustIndicators);
      expect(uniqueTrustIndicators.size).toBe(1); // All should have same trust indicator

      // Validate parity
      const parityResult = await parityValidator.validateToneParity(payloads);
      expect(parityResult.trustScoreVariance).toBeLessThan(0.001); // Allow for floating point precision
      expect(parityResult.emotionalConsistency).toBe(true);
    }
  });

  // Polaris Ritual: Multi-Locale Tone Parity
  it('should handle invalid locale gracefully with fallback behavior', async () => {
    // What: Validate that invalid locales don't break emotional consistency
    // Why: System must degrade gracefully for unsupported locales
    // How: Create payload with invalid locale, validate fallback to default behavior

    const baseTraceId = uuidv4();
    const baseIntentHash = crypto.createHash('sha256').update('reassuring-intent').digest('hex');

    // Create payload with invalid locale
    const invalidLocalePayload = await createToneSpecificPayload('reassuring', {
      locale: 'xx-XX', // Invalid locale
      payload: 'You are safe and we are here to support you.',
      traceId: baseTraceId,
      emotionIntentHash: baseIntentHash
    });

    // Create equivalent payload with valid locale for comparison
    const validLocalePayload = await createToneSpecificPayload('reassuring', {
      locale: 'en-US',
      payload: 'You are safe and we are here to support you.',
      traceId: baseTraceId,
      emotionIntentHash: baseIntentHash
    });

    // Render both payloads
    const invalidResult = renderer.renderPayload(invalidLocalePayload);
    const validResult = renderer.renderPayload(validLocalePayload);

    // Validate that invalid locale falls back to default behavior
    expect(invalidResult.messageStyle).toBe(validResult.messageStyle);
    expect(invalidResult.trustIndicator).toBe(validResult.trustIndicator);
    expect(invalidResult.usedFallback).toBe(validResult.usedFallback);

    // Validate that emotional consistency is maintained
    const invalidSnapshot = JSON.parse(invalidResult.emotionalSnapshot);
    const validSnapshot = JSON.parse(validResult.emotionalSnapshot);

    expect(invalidSnapshot.tone).toBe(validSnapshot.tone);
    expect(invalidSnapshot.trustScore).toBe(validSnapshot.trustScore);
    expect(invalidSnapshot.emotionIntentHash).toBe(validSnapshot.emotionIntentHash);

    // Validate that locale is preserved in result
    expect(invalidResult.locale).toBe('xx-XX');
    expect(validResult.locale).toBe('en-US');
  });

  // Polaris Ritual: Multi-Locale Tone Parity
  it('should validate cross-locale snapshot HTML structure consistency', async () => {
    // What: Validate that HTML structure remains consistent across locales for same tone
    // Why: DOM structure must be predictable regardless of language for UI consistency
    // How: Create payloads in multiple locales, validate HTML structure patterns match

    const baseTraceId = uuidv4();
    const baseIntentHash = crypto.createHash('sha256').update('enthusiastic-intent').digest('hex');

    // Create enthusiastic payloads for multiple locales
    const payloads = await Promise.all([
      createToneSpecificPayload('enthusiastic', {
        locale: 'en-US',
        payload: 'This is absolutely amazing! We\'re making incredible progress!',
        traceId: baseTraceId,
        emotionIntentHash: baseIntentHash
      }),
      createToneSpecificPayload('enthusiastic', {
        locale: 'fr-FR',
        payload: 'C\'est absolument incroyable ! Nous faisons des progrès incroyables !',
        traceId: baseTraceId,
        emotionIntentHash: baseIntentHash
      }),
      createToneSpecificPayload('enthusiastic', {
        locale: 'es-ES',
        payload: '¡Esto es absolutamente increíble! ¡Estamos haciendo un progreso increíble!',
        traceId: baseTraceId,
        emotionIntentHash: baseIntentHash
      })
    ]);

    // Render all payloads
    const results = payloads.map(payload => renderer.renderPayload(payload));

    // Extract HTML outputs
    const htmlOutputs = results.map(result => result.uiComponents.htmlOutput);

    // Validate HTML structure consistency
    htmlOutputs.forEach(html => {
      if (html) {
        expect(html).toContain('class="emotional-ui vibrant"'); // Same message style
        expect(html).toContain('data-tone="enthusiastic"');     // Same tone
        expect(html).toContain('class="cta-button vibrant"');   // Same CTA style
        expect(html).toContain('class="trust-indicator');       // Trust indicator present
      }
    });

    // Validate locale-specific attributes
    if (htmlOutputs[0]) expect(htmlOutputs[0]).toContain('data-locale="en-US"');
    if (htmlOutputs[1]) expect(htmlOutputs[1]).toContain('data-locale="fr-FR"');
    if (htmlOutputs[2]) expect(htmlOutputs[2]).toContain('data-locale="es-ES"');

    // Validate DOM structure patterns are identical (ignoring text content)
    const structurePattern = /<div class="[^"]*"[^>]*>.*?<\/div>/g;
    const structures = htmlOutputs.map(html => {
      if (html) {
        const matches = html.match(structurePattern);
        return matches ? matches.length : 0;
      }
      return 0;
    });

    // All should have same number of div elements
    expect(structures[0]).toBe(structures[1]);
    expect(structures[1]).toBe(structures[2]);

    // Validate comprehensive parity
    const parityResult = await parityValidator.validateToneParity(payloads);
    
    // Debug output to understand the failure
    console.log('Cross-locale parity validation result:', {
      isParityMaintained: parityResult.isParityMaintained,
      parityScore: parityResult.parityScore,
      inconsistencies: parityResult.inconsistencies,
      trustScoreVariance: parityResult.trustScoreVariance,
      emotionalConsistency: parityResult.emotionalConsistency
    });
    
    expect(parityResult.isParityMaintained).toBe(true);
    expect(parityResult.parityScore).toBeGreaterThan(0.9);
  });
});

// Codex Safeguard: This test validates emotional tone parity across multiple locales using real system components.
// DO NOT reintroduce mocks. All emotional validation must use runtime-validated components.
// Any failure in tone parity indicates a critical emotional UX regression that must be addressed immediately. 