/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Validate SparkOverlay component behavior"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Unit tests for spark display and interaction
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SparkOverlay } from '../../cursor/components/SparkOverlay';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { SessionReuseEngine } from '../../cursor/utils/sessionReuseEngine';

// Mock dependencies
jest.mock('../../cursor/event-bus/eventBus');
jest.mock('../../cursor/utils/sessionReuseEngine');
jest.mock('../../cursor/utils/audit-utils', () => ({
  emitSystemLog: jest.fn()
}));

describe('SparkOverlay Component', () => {
  const mockContext = 'launch a coffee brand';
  const mockOnSparkSelected = jest.fn();
  const mockEventBus = {
    emit: jest.fn(),
    on: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (EventBus.getInstance as jest.Mock).mockReturnValue(mockEventBus);
  });

  describe('Loading State', () => {
    it('displays loading message when concepts are being fetched', () => {
      render(<SparkOverlay context={mockContext} onSparkSelected={mockOnSparkSelected} />);
      expect(screen.getByText("We're crafting the perfect ideas for you...")).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message and retry button when loading fails', async () => {
      // Mock generateConcepts to throw error
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to load'));
      
      render(<SparkOverlay context={mockContext} onSparkSelected={mockOnSparkSelected} />);
      
      await waitFor(() => {
        expect(screen.getByText("We're crafting the perfect ideas for you...")).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    it('reloads page when retry button is clicked', async () => {
      const mockReload = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true
      });

      render(<SparkOverlay context={mockContext} onSparkSelected={mockOnSparkSelected} />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Try Again'));
        expect(mockReload).toHaveBeenCalled();
      });
    });
  });

  describe('Reused Spark Display', () => {
    const mockReusedSpark = {
      sparkName: 'The Espresso Mission',
      metrics: {
        emotionalResonance: 0.92,
        conversion: 0.88
      }
    };

    beforeEach(() => {
      (SessionReuseEngine.prototype.getTopPerformingSpark as jest.Mock).mockReturnValue(mockReusedSpark);
    });

    it('displays reused spark section when available', async () => {
      render(<SparkOverlay context={mockContext} onSparkSelected={mockOnSparkSelected} />);
      
      await waitFor(() => {
        expect(screen.getByText('Previously Successful')).toBeInTheDocument();
        expect(screen.getByText('The Espresso Mission')).toBeInTheDocument();
        expect(screen.getByText('Previously Successful')).toBeInTheDocument();
      });
    });

    it('applies reused styling to reused spark card', async () => {
      render(<SparkOverlay context={mockContext} onSparkSelected={mockOnSparkSelected} />);
      
      await waitFor(() => {
        const reusedCard = screen.getByText('The Espresso Mission').closest('.spark-card');
        expect(reusedCard).toHaveClass('reused');
      });
    });
  });

  describe('Trust Threshold', () => {
    it('emits trust breach event when score falls below threshold', async () => {
      const lowTrustConcept = {
        name: 'Low Trust Concept',
        emotionalResonance: 0.3,
        trustScore: 3.8
      };

      render(<SparkOverlay context={mockContext} onSparkSelected={mockOnSparkSelected} />);
      
      await waitFor(() => {
        expect(mockEventBus.emit).toHaveBeenCalledWith('TRUST_THRESHOLD_BREACH', {
          score: 3.8,
          concept: lowTrustConcept
        });
      });
    });
  });

  describe('CTA Preview', () => {
    it('injects spark name into CTA button text', async () => {
      render(<SparkOverlay context={mockContext} onSparkSelected={mockOnSparkSelected} />);
      
      await waitFor(() => {
        expect(screen.getByText('Get My The Flavor Magnet Blueprint')).toBeInTheDocument();
        expect(screen.getByText('Get My The Espresso Mission Blueprint')).toBeInTheDocument();
        expect(screen.getByText('Get My The 3-Day Loyalty Drop Blueprint')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('emits spark selection event when card is clicked', async () => {
      render(<SparkOverlay context={mockContext} onSparkSelected={mockOnSparkSelected} />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('The Flavor Magnet'));
        expect(mockEventBus.emit).toHaveBeenCalledWith('SPARK_SELECTED', {
          concept: expect.objectContaining({
            name: 'The Flavor Magnet'
          }),
          context: mockContext
        });
      });
    });

    it('calls onSparkSelected with correct concept data', async () => {
      render(<SparkOverlay context={mockContext} onSparkSelected={mockOnSparkSelected} />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('The Flavor Magnet'));
        expect(mockOnSparkSelected).toHaveBeenCalledWith(expect.objectContaining({
          name: 'The Flavor Magnet',
          emotionalResonance: 0.85,
          trustScore: 0.9
        }));
      });
    });
  });
}); 