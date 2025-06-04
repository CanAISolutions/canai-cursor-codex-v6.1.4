/**
 * BidirectionalTextAnalyzer Class
 * 
 * Provides sophisticated analysis of bidirectional text (LTR and RTL)
 * for proper handling of mixed-direction content.
 */
import { Logger } from '../logger';

// Define text direction type that includes 'neutral'
export type TextDirection = 'ltr' | 'rtl' | 'neutral';

export class BidirectionalTextAnalyzer {
  private logger: Logger;
  
  constructor(logger?: Logger) {
    this.logger = logger || new Logger('BidirectionalTextAnalyzer');
  }
  
  /**
   * Checks if content contains RTL characters
   * 
   * @param content - The text to analyze
   * @returns Whether the text contains RTL characters
   */
  containsRTLCharacters(content: string): boolean {
    try {
      // Comprehensive RTL character detection
      // Arabic, Hebrew, Syriac, Thaana, N'Ko, Samaritan, Mandaic,
      // Arabic Presentation Forms, etc.
      const rtlPattern = /[\u0590-\u07FF\u08A0-\u08FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
      return rtlPattern.test(content);
    } catch (error) {
      this.logger.error('Error in containsRTLCharacters', { error, contentLength: content.length });
      return false;
    }
  }
  
  /**
   * Checks if content contains LTR characters
   * 
   * @param content - The text to analyze
   * @returns Whether the text contains LTR characters
   */
  containsLTRCharacters(content: string): boolean {
    try {
      // Comprehensive LTR character detection
      // Basic Latin, Latin-1 Supplement, Latin Extended, etc.
      const ltrPattern = /[A-Za-z\u00C0-\u00FF\u0100-\u017F\u0180-\u024F]/;
      return ltrPattern.test(content);
    } catch (error) {
      this.logger.error('Error in containsLTRCharacters', { error, contentLength: content.length });
      return false;
    }
  }
  
  /**
   * Analyzes directional segments in text
   * 
   * @param content - The text to analyze
   * @returns Detailed analysis of directional segments
   */
  analyzeDirectionalSegments(content: string): DirectionalAnalysisResult {
    try {
      if (!content) {
        return { 
          segmentCount: 0, 
          segments: [], 
          complexityScore: 0 
        };
      }
      
      const segments: TextDirectionSegment[] = [];
      let currentDirection = this.getCharacterDirection(content.charAt(0));
      let segmentStart = 0;
      let complexityFactors = 0;
      
      // First pass: identify basic segments
      for (let i = 1; i < content.length; i++) {
        const charDirection = this.getCharacterDirection(content.charAt(i));
        
        // Direction change detected
        if (charDirection !== currentDirection && charDirection !== 'neutral') {
          // Complete current segment
          segments.push({
            text: content.substring(segmentStart, i),
            direction: currentDirection === 'neutral' ? 'ltr' : currentDirection,
            startIndex: segmentStart,
            endIndex: i - 1
          });
          
          // Start new segment
          segmentStart = i;
          currentDirection = charDirection;
          complexityFactors++;
        }
        
        // Special handling for neutral characters
        if (charDirection === 'neutral') {
          // For neutral characters, maintain the current direction
          // but track complexity
          if (i > 0 && i < content.length - 1) {
            const prevChar = this.getCharacterDirection(content.charAt(i - 1));
            const nextChar = this.getCharacterDirection(content.charAt(i + 1));
            
            if (prevChar !== nextChar && prevChar !== 'neutral' && nextChar !== 'neutral') {
              complexityFactors++;
            }
          }
        }
      }
      
      // Add the final segment
      segments.push({
        text: content.substring(segmentStart),
        direction: currentDirection === 'neutral' ? 'ltr' : currentDirection,
        startIndex: segmentStart,
        endIndex: content.length - 1
      });
      
      // Second pass: refine segments by merging neutral characters appropriately
      const refinedSegments = this.refineSegments(segments);
      
      // Calculate complexity score based on segment count and complexity factors
      // Higher score means more complex bidirectional text
      const complexityScore = Math.min(10, (refinedSegments.length * 1.5) + (complexityFactors * 0.5));
      
      return {
        segmentCount: refinedSegments.length,
        segments: refinedSegments,
        complexityScore
      };
    } catch (error) {
      this.logger.error('Error in analyzeDirectionalSegments', { error, contentLength: content.length });
      
      // Return safe fallback
      return {
        segmentCount: 1,
        segments: [{
          text: content,
          direction: 'ltr',
          startIndex: 0,
          endIndex: content.length - 1
        }],
        complexityScore: 0
      };
    }
  }
  
  /**
   * Gets the direction of a single character
   * 
   * @param char - The character to analyze
   * @returns The direction of the character
   */
  private getCharacterDirection(char: string): TextDirection {
    if (!char) return 'neutral';
    
    // RTL character ranges
    const rtlPattern = /[\u0590-\u07FF\u08A0-\u08FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    
    // LTR character ranges
    const ltrPattern = /[A-Za-z\u00C0-\u00FF\u0100-\u017F\u0180-\u024F]/;
    
    // Neutral character ranges (digits, punctuation, whitespace)
    const neutralPattern = /[\s\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
    
    if (rtlPattern.test(char)) return 'rtl';
    if (ltrPattern.test(char)) return 'ltr';
    if (neutralPattern.test(char)) return 'neutral';
    
    // Default to LTR for everything else
    return 'ltr';
  }
  
  /**
   * Refines segments by merging neutral characters appropriately
   * 
   * @param segments - The segments to refine
   * @returns Refined segments
   */
  private refineSegments(segments: TextDirectionSegment[]): TextDirectionSegment[] {
    if (segments.length <= 1) return segments;
    
    const refined: TextDirectionSegment[] = [segments[0]];
    
    for (let i = 1; i < segments.length; i++) {
      const current = segments[i];
      const previous = refined[refined.length - 1];
      
      // If either segment is very short (1-2 chars), consider merging
      const shouldMerge = (
        (current.text.length <= 2 && this.isNeutralText(current.text)) ||
        (previous.text.length <= 2 && this.isNeutralText(previous.text))
      );
      
      if (shouldMerge) {
        // Merge with previous segment
        previous.text += current.text;
        previous.endIndex = current.endIndex;
      } else {
        // Add as new segment
        refined.push(current);
      }
    }
    
    return refined;
  }
  
  /**
   * Checks if text consists only of neutral characters
   * 
   * @param text - The text to check
   * @returns Whether the text consists only of neutral characters
   */
  private isNeutralText(text: string): boolean {
    for (let i = 0; i < text.length; i++) {
      if (this.getCharacterDirection(text.charAt(i)) !== 'neutral') {
        return false;
      }
    }
    return true;
  }
}

/**
 * Interface for directional analysis result
 */
export interface DirectionalAnalysisResult {
  segmentCount: number;
  segments: TextDirectionSegment[];
  complexityScore: number;
}

/**
 * Interface for text direction segment
 */
export interface TextDirectionSegment {
  text: string;
  direction: 'ltr' | 'rtl';
  startIndex: number;
  endIndex: number;
} 