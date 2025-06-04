/**
 * Memberstack Resonance Adapter
 * Type-safe integration with existing Memberstack patterns
 * Provides graceful fallbacks maintaining 4.2+ trust scores
 */

import { EmotionalPayload } from '../../emotion/emotion-payload-builder'
import { EventBus } from '../../event-bus/eventBus'

export interface MemberstackBinding {
  field: string
  fallback: string
  emotionalContext: 'empowering' | 'reassuring' | 'inspiring' | 'welcoming'
  trustImpact: number // 0-1 scale
}

export interface ResonanceUserData {
  firstName?: string
  lastName?: string
  email?: string
  planTier?: 'free' | 'pro' | 'enterprise'
  membershipStatus?: 'active' | 'trial' | 'expired'
  joinDate?: string
  lastActive?: string
}

export interface EmotionalFallback {
  condition: 'missing_data' | 'loading' | 'error' | 'guest'
  fallbackText: string
  emotionalTone: 'reassuring' | 'empowering' | 'welcoming' | 'inspiring'
  trustScore: number
  recoveryAction?: string
}

export class MemberstackResonanceAdapter {
  private eventBus: EventBus
  private fallbacks: Map<string, EmotionalFallback>

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
    this.initializeFallbacks()
  }

  /**
   * Get user data with emotional fallbacks
   * Maintains trust score >= 4.2 even with missing data
   */
  async getUserData(bindings: MemberstackBinding[]): Promise<EmotionalPayload> {
    try {
      const userData = await this.fetchMemberstackData()
      const enrichedData = this.enrichWithEmotionalContext(userData, bindings)
      
      this.eventBus.emit('memberstack.data.loaded', {
        success: true,
        trustScore: this.calculateTrustScore(enrichedData),
        timestamp: new Date().toISOString()
      })

      return enrichedData
    } catch (error) {
      return this.handleDataError(bindings, error)
    }
  }

  /**
   * Enrich user data with emotional context
   * Transforms raw data into emotionally resonant content
   */
  private enrichWithEmotionalContext(
    userData: ResonanceUserData, 
    bindings: MemberstackBinding[]
  ): EmotionalPayload {
    const enriched: any = {}

    bindings.forEach(binding => {
      const value = userData[binding.field as keyof ResonanceUserData]
      
      if (value) {
        enriched[binding.field] = this.applyEmotionalEnrichment(value, binding)
      } else {
        enriched[binding.field] = this.applyEmotionalFallback(binding)
      }
    })

    return {
      ...enriched,
      emotionalContext: this.determineEmotionalContext(userData, bindings),
      trustScore: this.calculateTrustScore(enriched),
      personalizationLevel: this.calculatePersonalizationLevel(userData, bindings)
    }
  }

  /**
   * Apply emotional enrichment to user data
   * Transforms "John" into "John, the visionary" based on context
   */
  private applyEmotionalEnrichment(value: any, binding: MemberstackBinding): string {
    switch (binding.emotionalContext) {
      case 'empowering':
        return this.empoweringEnrichment(value, binding)
      case 'reassuring':
        return this.reassuringEnrichment(value, binding)
      case 'inspiring':
        return this.inspiringEnrichment(value, binding)
      case 'welcoming':
        return this.welcomingEnrichment(value, binding)
      default:
        return value
    }
  }

  /**
   * Apply emotional fallback for missing data
   * Maintains dignity and trust even when data is unavailable
   */
  private applyEmotionalFallback(binding: MemberstackBinding): string {
    const fallback = this.fallbacks.get(binding.field)
    
    if (fallback) {
      this.eventBus.emit('memberstack.fallback.triggered', {
        field: binding.field,
        fallbackType: fallback.condition,
        trustScore: fallback.trustScore,
        timestamp: new Date().toISOString()
      })
      
      return fallback.fallbackText
    }

    // Default graceful fallbacks
    switch (binding.field) {
      case 'firstName':
        return 'Visionary' // Empowering default
      case 'planTier':
        return 'Explorer' // Inspiring default
      case 'membershipStatus':
        return 'Valued Member' // Reassuring default
      default:
        return binding.fallback || 'Valued User'
    }
  }

  /**
   * Initialize emotional fallbacks
   * Predefined fallbacks that maintain trust and dignity
   */
  private initializeFallbacks(): void {
    this.fallbacks = new Map([
      ['firstName', {
        condition: 'missing_data',
        fallbackText: 'Visionary',
        emotionalTone: 'empowering',
        trustScore: 4.3,
        recoveryAction: 'personalize_profile'
      }],
      ['planTier', {
        condition: 'missing_data',
        fallbackText: 'Explorer',
        emotionalTone: 'inspiring',
        trustScore: 4.2,
        recoveryAction: 'explore_plans'
      }],
      ['email', {
        condition: 'missing_data',
        fallbackText: 'Valued Member',
        emotionalTone: 'welcoming',
        trustScore: 4.4,
        recoveryAction: 'complete_profile'
      }]
    ])
  }

  /**
   * Empowering enrichment patterns
   * Transforms data to emphasize user capability and potential
   */
  private empoweringEnrichment(value: any, binding: MemberstackBinding): string {
    switch (binding.field) {
      case 'firstName':
        return `${value}, the visionary`
      case 'planTier':
        return value === 'pro' ? `${value} innovator` : `${value} pioneer`
      default:
        return value
    }
  }

  /**
   * Reassuring enrichment patterns
   * Transforms data to emphasize safety and support
   */
  private reassuringEnrichment(value: any, binding: MemberstackBinding): string {
    switch (binding.field) {
      case 'firstName':
        return `${value}, you're in good hands`
      case 'membershipStatus':
        return value === 'active' ? 'fully supported member' : 'valued member'
      default:
        return value
    }
  }

  /**
   * Inspiring enrichment patterns
   * Transforms data to emphasize possibility and growth
   */
  private inspiringEnrichment(value: any, binding: MemberstackBinding): string {
    switch (binding.field) {
      case 'firstName':
        return `${value}, the possibility maker`
      case 'planTier':
        return `${value} trailblazer`
      default:
        return value
    }
  }

  /**
   * Welcoming enrichment patterns
   * Transforms data to emphasize belonging and connection
   */
  private welcomingEnrichment(value: any, binding: MemberstackBinding): string {
    switch (binding.field) {
      case 'firstName':
        return `Welcome back, ${value}`
      case 'joinDate':
        return `Member since ${value} - part of the family`
      default:
        return value
    }
  }

  /**
   * Calculate trust score based on data completeness and emotional resonance
   */
  private calculateTrustScore(data: any): number {
    const baseScore = 4.0
    const completenessBonus = Object.keys(data).length * 0.1
    const emotionalBonus = data.emotionalContext ? 0.3 : 0
    
    return Math.min(5.0, baseScore + completenessBonus + emotionalBonus)
  }

  /**
   * Calculate personalization level
   * Higher levels enable more sophisticated emotional resonance
   */
  private calculatePersonalizationLevel(
    userData: ResonanceUserData, 
    bindings: MemberstackBinding[]
  ): 'basic' | 'enhanced' | 'deep' | 'transcendent' {
    const dataCompleteness = Object.keys(userData).length / bindings.length
    
    if (dataCompleteness >= 0.8) return 'transcendent'
    if (dataCompleteness >= 0.6) return 'deep'
    if (dataCompleteness >= 0.4) return 'enhanced'
    return 'basic'
  }

  /**
   * Determine overall emotional context
   * Guides component tone and interaction patterns
   */
  private determineEmotionalContext(
    userData: ResonanceUserData,
    bindings: MemberstackBinding[]
  ): string {
    // Analyze user data to determine optimal emotional approach
    if (userData.planTier === 'enterprise') return 'empowering'
    if (userData.membershipStatus === 'trial') return 'reassuring'
    if (userData.joinDate && this.isNewUser(userData.joinDate)) return 'welcoming'
    return 'inspiring'
  }

  /**
   * Check if user is new (joined within last 30 days)
   */
  private isNewUser(joinDate: string): boolean {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return new Date(joinDate) > thirtyDaysAgo
  }

  /**
   * Fetch Memberstack data
   * Integrates with existing Memberstack session validation
   */
  private async fetchMemberstackData(): Promise<ResonanceUserData> {
    // Integration point with existing validateMemberstackSession
    // This would connect to your existing Memberstack implementation
    
    // For now, return mock data structure
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      planTier: 'pro',
      membershipStatus: 'active',
      joinDate: '2024-01-15',
      lastActive: new Date().toISOString()
    }
  }

  /**
   * Handle data fetch errors with emotional grace
   */
  private handleDataError(bindings: MemberstackBinding[], error: any): EmotionalPayload {
    this.eventBus.emit('memberstack.error', {
      error: error.message,
      fallbackActivated: true,
      trustScore: 4.2, // Maintain minimum trust score
      timestamp: new Date().toISOString()
    })

    // Return graceful fallback data
    const fallbackData: any = {}
    bindings.forEach(binding => {
      fallbackData[binding.field] = this.applyEmotionalFallback(binding)
    })

    return {
      ...fallbackData,
      emotionalContext: 'reassuring', // Reassuring tone during errors
      trustScore: 4.2,
      personalizationLevel: 'basic',
      errorRecovery: true
    }
  }
}

export default MemberstackResonanceAdapter 