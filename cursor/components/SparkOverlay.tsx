/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Display emotionally resonant spark concepts"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Frontend components for spark display and interaction
 */

import React, { useState, useEffect } from 'react';
import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from '../utils/audit-utils';
import { SessionReuseEngine } from '../utils/sessionReuseEngine';

interface SparkConcept {
  name: string;
  tagline?: string;
  emotionalResonance: number;
  trustScore: number;
}

interface SparkCardProps {
  concept: SparkConcept;
  onSelect: (concept: SparkConcept) => void;
  isReused?: boolean;
}

const SparkCard: React.FC<SparkCardProps> = ({ concept, onSelect, isReused }) => {
  const [isHovered, setIsHovered] = useState(false);
  const eventBus = EventBus.getInstance();

  const handleMouseEnter = () => {
    setIsHovered(true);
    eventBus.emit('sparkCardViewed', {
      sparkName: concept.name,
      isReused,
      timestamp: new Date().toISOString()
    });
  };

  const handleClick = () => {
    eventBus.emit('sparkCardClicked', {
      sparkName: concept.name,
      isReused,
      emotionalResonance: concept.emotionalResonance,
      trustScore: concept.trustScore,
      timestamp: new Date().toISOString()
    });
    onSelect(concept);
  };

  return (
    <div
      className={`spark-card ${isReused ? 'reused' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <h3 className="spark-name">{concept.name}</h3>
      {concept.tagline && <p className="spark-tagline">{concept.tagline}</p>}
      <button 
        className="spark-cta"
        onClick={(e) => {
          e.stopPropagation();
          eventBus.emit('CTAClicked', {
            sparkName: concept.name,
            isReused,
            timestamp: new Date().toISOString()
          });
          handleClick();
        }}
      >
        Get My {concept.name} Blueprint
      </button>
      {isReused && <span className="reused-badge">Previously Successful</span>}
    </div>
  );
};

interface SparkOverlayProps {
  context: string;
  onSparkSelected: (concept: SparkConcept) => void;
}

export const SparkOverlay: React.FC<SparkOverlayProps> = ({ context, onSparkSelected }) => {
  const [concepts, setConcepts] = useState<SparkConcept[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reusedConcept, setReusedConcept] = useState<SparkConcept | null>(null);

  const eventBus = EventBus.getInstance();
  const sessionEngine = new SessionReuseEngine();

  useEffect(() => {
    const loadConcepts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check for reusable spark
        const reused = sessionEngine.getTopPerformingSpark(context);
        if (reused) {
          setReusedConcept({
            name: reused.sparkName,
            emotionalResonance: reused.metrics.emotionalResonance,
            trustScore: reused.metrics.conversion
          });
        }

        // Load new concepts
        const newConcepts = await generateConcepts(context);
        setConcepts(newConcepts);

        emitSystemLog('spark-concepts-loaded', {
          context,
          count: newConcepts.length,
          hasReused: !!reused
        });
      } catch (err) {
        setError("We're crafting the perfect ideas for you...");
        emitSystemLog('spark-load-error', {
          error: err.message,
          context
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConcepts();
  }, [context]);

  const handleConceptSelect = (concept: SparkConcept) => {
    onSparkSelected(concept);
    eventBus.emit('SPARK_SELECTED', { concept, context });
  };

  if (isLoading) {
    return (
      <div className="spark-overlay loading">
        <div className="loading-message">
          We're crafting the perfect ideas for you...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spark-overlay error">
        <div className="error-message">{error}</div>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="spark-overlay">
      {reusedConcept && (
        <div className="reused-section">
          <h2>Previously Successful</h2>
          <SparkCard
            concept={reusedConcept}
            onSelect={handleConceptSelect}
            isReused={true}
          />
        </div>
      )}
      <div className="new-concepts">
        <h2>New Ideas</h2>
        <div className="spark-grid">
          {concepts.map((concept, index) => (
            <SparkCard
              key={index}
              concept={concept}
              onSelect={handleConceptSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to generate concepts (would connect to actual generation system)
async function generateConcepts(context: string): Promise<SparkConcept[]> {
  // Implementation would connect to concept generation system
  return [
    {
      name: 'The Flavor Magnet',
      tagline: 'Turn first-time buyers into loyal fans',
      emotionalResonance: 0.85,
      trustScore: 0.9
    },
    {
      name: 'The Espresso Mission',
      tagline: 'Launch your coffee brand with confidence',
      emotionalResonance: 0.82,
      trustScore: 0.88
    },
    {
      name: 'The 3-Day Loyalty Drop',
      tagline: 'Create buzz and build your community',
      emotionalResonance: 0.88,
      trustScore: 0.92
    }
  ];
} 