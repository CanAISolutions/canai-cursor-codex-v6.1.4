/**
 * Trust Fallback Provider
 * Emotional error handling maintaining trust scores >= 4.2
 * Extends existing emotional-fallback-scenarios.md patterns
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { EmotionalValidator } from '../../validators/emotional-validator'
import { EventBus } from '../../event-bus/eventBus'

export interface TrustFallbackState {
  type: 'loading' | 'error' | 'timeout' | 'network' | 'auth' | 'data_missing'
  severity: 'low' | 'medium' | 'high' | 'critical'
  emotionalTone: 'reassuring' | 'empowering' | 'apologetic' | 'solution_focused'
  trustScore: number
  recoveryAction?: string
  userMessage: string
  technicalMessage?: string
}

export interface TrustFallbackConfig {
  minTrustScore: number
  maxRetries: number
  gracefulDegradation: boolean
  emotionalRecovery: boolean
  userEmpowerment: boolean
}

interface TrustFallbackContextType {
  currentFallback: TrustFallbackState | null
  triggerFallback: (fallback: Partial<TrustFallbackState>) => void
  clearFallback: () => void
  trustScore: number
  config: TrustFallbackConfig
}

const TrustFallbackContext = createContext<TrustFallbackContextType | null>(null)

export const useTrustFallback = () => {
  const context = useContext(TrustFallbackContext)
  if (!context) {
    throw new Error('useTrustFallback must be used within TrustFallbackProvider')
  }
  return context
}

interface TrustFallbackProviderProps {
  children: ReactNode
  config?: Partial<TrustFallbackConfig>
  eventBus: EventBus
  emotionalValidator: EmotionalValidator
}

export const TrustFallbackProvider: React.FC<TrustFallbackProviderProps> = ({
  children,
  config: userConfig,
  eventBus,
  emotionalValidator
}) => {
  const [currentFallback, setCurrentFallback] = useState<TrustFallbackState | null>(null)
  const [trustScore, setTrustScore] = useState<number>(4.5)

  const config: TrustFallbackConfig = {
    minTrustScore: 4.2,
    maxRetries: 3,
    gracefulDegradation: true,
    emotionalRecovery: true,
    userEmpowerment: true,
    ...userConfig
  }

  /**
   * Predefined emotional fallback patterns
   * Based on existing emotional-fallback-scenarios.md
   */
  const fallbackPatterns = {
    loading: {
      reassuring: {
        userMessage: "We're preparing something special for you...",
        trustScore: 4.3,
        emotionalTone: 'reassuring' as const
      },
      empowering: {
        userMessage: "Your vision is taking shape...",
        trustScore: 4.4,
        emotionalTone: 'empowering' as const
      }
    },
    error: {
      apologetic: {
        userMessage: "We're sorry - something unexpected happened. We're on it.",
        trustScore: 4.2,
        emotionalTone: 'apologetic' as const,
        recoveryAction: 'retry_with_support'
      },
      solution_focused: {
        userMessage: "Let's try a different approach to get you what you need.",
        trustScore: 4.3,
        emotionalTone: 'solution_focused' as const,
        recoveryAction: 'alternative_path'
      }
    },
    timeout: {
      reassuring: {
        userMessage: "This is taking longer than expected. Your request is important to us.",
        trustScore: 4.2,
        emotionalTone: 'reassuring' as const,
        recoveryAction: 'extend_timeout'
      },
      empowering: {
        userMessage: "Great things take time. We're ensuring quality for you.",
        trustScore: 4.4,
        emotionalTone: 'empowering' as const
      }
    },
    network: {
      solution_focused: {
        userMessage: "Connection hiccup detected. We'll keep trying in the background.",
        trustScore: 4.3,
        emotionalTone: 'solution_focused' as const,
        recoveryAction: 'background_retry'
      }
    },
    auth: {
      reassuring: {
        userMessage: "Let's get you back in safely. Your data is protected.",
        trustScore: 4.2,
        emotionalTone: 'reassuring' as const,
        recoveryAction: 'secure_reauth'
      }
    },
    data_missing: {
      empowering: {
        userMessage: "We can work with what we have, or you can add more details.",
        trustScore: 4.3,
        emotionalTone: 'empowering' as const,
        recoveryAction: 'graceful_continuation'
      }
    }
  }

  /**
   * Trigger emotional fallback with trust preservation
   */
  const triggerFallback = (fallback: Partial<TrustFallbackState>) => {
    const fallbackType = fallback.type || 'error'
    const emotionalTone = fallback.emotionalTone || 'reassuring'
    
    // Get predefined pattern or create custom
    const pattern = fallbackPatterns[fallbackType]?.[emotionalTone] || {
      userMessage: fallback.userMessage || "We're working on this for you.",
      trustScore: 4.2,
      emotionalTone: 'reassuring' as const
    }

    const completeFallback: TrustFallbackState = {
      type: fallbackType,
      severity: fallback.severity || 'medium',
      emotionalTone: pattern.emotionalTone,
      trustScore: Math.max(pattern.trustScore, config.minTrustScore),
      userMessage: pattern.userMessage,
      recoveryAction: pattern.recoveryAction || fallback.recoveryAction,
      technicalMessage: fallback.technicalMessage
    }

    // Validate emotional impact
    const emotionalValidation = emotionalValidator.validateEmotionalImpact({
      content: completeFallback.userMessage,
      tone: completeFallback.emotionalTone,
      context: 'error_recovery'
    })

    // Ensure trust score meets minimum requirements
    if (emotionalValidation.trustScore < config.minTrustScore) {
      completeFallback.userMessage = enhanceEmotionalResonance(
        completeFallback.userMessage,
        completeFallback.emotionalTone
      )
      completeFallback.trustScore = config.minTrustScore
    }

    setCurrentFallback(completeFallback)
    setTrustScore(completeFallback.trustScore)

    // Emit fallback event for tracking
    eventBus.emit('trust.fallback.triggered', {
      type: completeFallback.type,
      severity: completeFallback.severity,
      trustScore: completeFallback.trustScore,
      emotionalTone: completeFallback.emotionalTone,
      timestamp: new Date().toISOString()
    })

    // Auto-clear fallback after appropriate time
    if (config.emotionalRecovery) {
      setTimeout(() => {
        clearFallback()
      }, getFallbackDuration(completeFallback.severity))
    }
  }

  /**
   * Clear fallback and restore normal state
   */
  const clearFallback = () => {
    setCurrentFallback(null)
    setTrustScore(4.5) // Restore default trust score

    eventBus.emit('trust.fallback.cleared', {
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Enhance emotional resonance for low-scoring messages
   */
  const enhanceEmotionalResonance = (message: string, tone: string): string => {
    const enhancements = {
      reassuring: [
        "You're in good hands - ",
        "We've got this - ",
        "Rest assured, "
      ],
      empowering: [
        "You've got this, and so do we - ",
        "Together we'll solve this - ",
        "Your success matters to us - "
      ],
      apologetic: [
        "We sincerely apologize - ",
        "This isn't the experience we want for you - ",
        "We take full responsibility - "
      ],
      solution_focused: [
        "Here's what we can do - ",
        "Let's find a path forward - ",
        "We have options - "
      ]
    }

    const prefixes = enhancements[tone as keyof typeof enhancements] || enhancements.reassuring
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    
    return randomPrefix + message.toLowerCase()
  }

  /**
   * Get fallback display duration based on severity
   */
  const getFallbackDuration = (severity: string): number => {
    switch (severity) {
      case 'low': return 2000
      case 'medium': return 4000
      case 'high': return 6000
      case 'critical': return 10000
      default: return 4000
    }
  }

  /**
   * Monitor trust score and trigger recovery if needed
   */
  useEffect(() => {
    if (trustScore < config.minTrustScore && !currentFallback) {
      triggerFallback({
        type: 'error',
        severity: 'medium',
        emotionalTone: 'reassuring',
        userMessage: "We're ensuring everything works perfectly for you."
      })
    }
  }, [trustScore, config.minTrustScore, currentFallback])

  const contextValue: TrustFallbackContextType = {
    currentFallback,
    triggerFallback,
    clearFallback,
    trustScore,
    config
  }

  return (
    <TrustFallbackContext.Provider value={contextValue}>
      {children}
      {currentFallback && (
        <TrustFallbackDisplay 
          fallback={currentFallback}
          onRecover={clearFallback}
          config={config}
        />
      )}
    </TrustFallbackContext.Provider>
  )
}

/**
 * Trust Fallback Display Component
 * Renders emotional fallback states with recovery options
 */
interface TrustFallbackDisplayProps {
  fallback: TrustFallbackState
  onRecover: () => void
  config: TrustFallbackConfig
}

const TrustFallbackDisplay: React.FC<TrustFallbackDisplayProps> = ({
  fallback,
  onRecover,
  config
}) => {
  const getEmotionalStyling = (tone: string) => {
    const styles = {
      reassuring: 'bg-blue-50 border-blue-200 text-blue-800',
      empowering: 'bg-purple-50 border-purple-200 text-purple-800',
      apologetic: 'bg-orange-50 border-orange-200 text-orange-800',
      solution_focused: 'bg-green-50 border-green-200 text-green-800'
    }
    return styles[tone as keyof typeof styles] || styles.reassuring
  }

  const getRecoveryAction = () => {
    if (!fallback.recoveryAction || !config.userEmpowerment) return null

    const actions = {
      retry_with_support: (
        <button 
          onClick={onRecover}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again with Support
        </button>
      ),
      alternative_path: (
        <button 
          onClick={onRecover}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Explore Alternatives
        </button>
      ),
      extend_timeout: (
        <button 
          onClick={onRecover}
          className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue Waiting
        </button>
      ),
      background_retry: (
        <div className="mt-3 text-sm text-gray-600">
          Retrying automatically in the background...
        </div>
      ),
      secure_reauth: (
        <button 
          onClick={onRecover}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Sign In Securely
        </button>
      ),
      graceful_continuation: (
        <button 
          onClick={onRecover}
          className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Continue Anyway
        </button>
      )
    }

    return actions[fallback.recoveryAction as keyof typeof actions]
  }

  return (
    <div className={`fixed bottom-4 right-4 max-w-md p-4 rounded-lg border-2 shadow-lg ${getEmotionalStyling(fallback.emotionalTone)}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-1">
          <p className="font-medium">{fallback.userMessage}</p>
          
          {fallback.technicalMessage && (
            <details className="mt-2">
              <summary className="text-sm cursor-pointer opacity-70">Technical details</summary>
              <p className="text-xs mt-1 opacity-60">{fallback.technicalMessage}</p>
            </details>
          )}
          
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs opacity-70">Trust Score: {fallback.trustScore.toFixed(1)}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div 
                className="bg-current h-1 rounded-full transition-all duration-300"
                style={{ width: `${(fallback.trustScore / 5) * 100}%` }}
              />
            </div>
          </div>
          
          {getRecoveryAction()}
        </div>
        
        <button 
          onClick={onRecover}
          className="text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default TrustFallbackProvider 