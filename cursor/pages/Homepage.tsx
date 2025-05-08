/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Create emotionally resonant homepage"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Main entry point for CanAI experience
 */

import React, { useState, useEffect } from 'react';
import { EventBus } from '../event-bus/eventBus';
import { DiscoveryFunnel } from '../components/DiscoveryFunnel';
import { emitSystemLog } from '../utils/audit-utils';
import { SparkAnalytics } from '../utils/sessionReuseEngine';
import './Homepage.css';

interface Testimonial {
  id: string;
  sparkName: string;
  promptType: string;
  quote: string;
  author: string;
  role: string;
  trustScore: number;
  timestamp: string;
}

interface HomepageProps {
  onSparkGenerated?: (spark: SparkAnalytics) => void;
}

export const Homepage: React.FC<HomepageProps> = ({ onSparkGenerated }) => {
  const [showFunnel, setShowFunnel] = useState<boolean>(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const eventBus = EventBus.getInstance();

  useEffect(() => {
    eventBus.emit('homepageViewed', {
      timestamp: new Date().toISOString()
    });

    // Load testimonials from PromptLogs
    const loadTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        setTestimonials(data.filter((t: Testimonial) => t.trustScore >= 4.2));
      } catch (error) {
        emitSystemLog('testimonial-load-error', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    loadTestimonials();
  }, []);

  const handleStartSpark = () => {
    eventBus.emit('startSparkClicked', {
      timestamp: new Date().toISOString()
    });
    setShowFunnel(true);
  };

  const handleSparkGenerated = (spark: SparkAnalytics) => {
    if (onSparkGenerated) {
      onSparkGenerated(spark);
    }
    setShowFunnel(false);
  };

  const handleTestimonialClick = (testimonial: Testimonial) => {
    eventBus.emit('testimonialClicked', {
      testimonialId: testimonial.id,
      sparkName: testimonial.sparkName,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="homepage">
      <section className="hero">
        <h1>Your AI Strategy Engine — Built for You</h1>
        <p className="hero-subtitle">
          Transform your ideas into powerful strategies with emotionally intelligent AI
        </p>
        <button 
          className="cta-button"
          onClick={handleStartSpark}
        >
          Start with a Spark
        </button>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Discovery</h3>
            <p>Share your challenge and emotional style</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Spark</h3>
            <p>Get emotionally resonant concept names</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Blueprint</h3>
            <p>Receive your personalized strategy</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="testimonial-card"
              onClick={() => handleTestimonialClick(testimonial)}
            >
              <p className="quote">{testimonial.quote}</p>
              <p className="author">— {testimonial.author}, {testimonial.role}</p>
              <p className="spark-name">Created with: {testimonial.sparkName}</p>
            </div>
          ))}
        </div>
      </section>

      {showFunnel && (
        <div className="funnel-modal">
          <div className="funnel-content">
            <button 
              className="close-button"
              onClick={() => setShowFunnel(false)}
            >
              ×
            </button>
            <DiscoveryFunnel onSparkGenerated={handleSparkGenerated} />
          </div>
        </div>
      )}
    </div>
  );
}; 