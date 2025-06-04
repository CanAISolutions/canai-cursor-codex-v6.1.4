/**
 * SparkSplit Visualization Component
 * 95% Comprehension Target - Revolutionary Trust Transparency
 * 
 * Framework: Codex v6.1.4 - Emotional Sovereignty Manifesto Aligned
 * Purpose: Side-by-side comparison of sterile vs. CanAI enhanced outputs
 * Target: 95% user comprehension of trust differences
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Heart, 
  Lightbulb, 
  Shield, 
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Sparkles
} from 'lucide-react';

// Data structures aligned with Supabase schema
interface EmotionalCompass {
  awe: number;        // Wonder and inspiration (0-1)
  ownership: number;  // User empowerment and control (0-1)
  wonder: number;     // Curiosity and engagement (0-1)
  calm: number;       // Peace and confidence (0-1)
  power: number;      // Capability and effectiveness (0-1)
}

interface SparkSplitData {
  comparisonId: string;
  sessionId: string;
  promptType: string;
  sterileOutput: string;
  enhancedOutput: string;
  trustDelta: number;
  emotionalCompass: EmotionalCompass;
  userSelection?: 'sterile' | 'canai' | 'both' | 'neither' | 'skip';
  educationalMoment: boolean;
  transparencyTrust: number;
  viralPotential: number;
  conversionLift: number;
  statisticalSignificance: number;
  marketingReady: boolean;
}

interface SparkSplitVisualizationProps {
  data?: SparkSplitData;
  loading?: boolean;
  onUserSelection?: (selection: 'sterile' | 'canai' | 'both' | 'neither' | 'skip') => void;
  onEducationalFeedback?: (learned: boolean, feedback?: string) => void;
  className?: string;
}

// Color scheme optimized for 95% comprehension
const COLORS = {
  sterile: {
    primary: '#6B7280',    // Gray - neutral, uninspiring
    secondary: '#9CA3AF',
    background: '#F9FAFB',
    border: '#E5E7EB'
  },
  canai: {
    primary: '#00CFFF',    // CanAI brand blue - inspiring, trustworthy
    secondary: '#00F0FF',
    background: '#F0FDFF',
    border: '#B3F0FF'
  },
  trust: {
    high: '#10B981',      // Green - high trust
    medium: '#F59E0B',    // Amber - medium trust
    low: '#EF4444'        // Red - low trust
  },
  emotional: {
    awe: '#8B5CF6',       // Purple - wonder/inspiration
    ownership: '#059669', // Emerald - empowerment
    wonder: '#0EA5E9',    // Sky blue - curiosity
    calm: '#06B6D4',      // Cyan - peace
    power: '#DC2626'      // Red - capability
  }
};

// Fallback component when data is missing
const FallbackUI: React.FC<{ reason: string }> = ({ reason }) => (
  <Card className="w-full max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        SparkSplit Comparison Unavailable
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Alert>
        <AlertDescription>
          {reason === 'no-data' && 'No comparison data available. This feature requires emotional compass data to function.'}
          {reason === 'loading' && 'Loading comparison data... Please wait while we analyze the outputs.'}
          {reason === 'error' && 'An error occurred while loading the comparison. Please try again.'}
        </AlertDescription>
      </Alert>
      <div className="mt-4 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">What is SparkSplit?</h3>
        <p className="text-sm text-gray-600 mb-4">
          SparkSplit shows you the difference between generic AI output and CanAI's emotionally intelligent approach. 
          It helps you understand why CanAI creates more trustworthy, resonant content.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Sterile AI:</strong> Functional but generic
          </div>
          <div>
            <strong>CanAI Enhanced:</strong> Emotionally resonant and trustworthy
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Emotional Compass Visualization (5-axis)
const EmotionalCompassChart: React.FC<{ 
  compass: EmotionalCompass; 
  title: string;
  variant: 'sterile' | 'canai';
}> = ({ compass, title, variant }) => {
  const axes = [
    { key: 'awe', label: 'Awe', icon: Sparkles, color: COLORS.emotional.awe },
    { key: 'ownership', label: 'Ownership', icon: Shield, color: COLORS.emotional.ownership },
    { key: 'wonder', label: 'Wonder', icon: Lightbulb, color: COLORS.emotional.wonder },
    { key: 'calm', label: 'Calm', icon: Heart, color: COLORS.emotional.calm },
    { key: 'power', label: 'Power', icon: Zap, color: COLORS.emotional.power }
  ];

  const averageScore = Object.values(compass).reduce((sum, val) => sum + val, 0) / 5;
  const colorScheme = variant === 'canai' ? COLORS.canai : COLORS.sterile;

  return (
    <div className={`p-4 rounded-lg border-2 ${variant === 'canai' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
      <h4 className="font-semibold mb-3 text-center" style={{ color: colorScheme.primary }}>
        {title}
      </h4>
      <div className="space-y-3">
        {axes.map(({ key, label, icon: Icon, color }) => {
          const score = compass[key as keyof EmotionalCompass];
          const percentage = Math.round(score * 100);
          
          return (
            <div key={key} className="flex items-center gap-3">
              <Icon className="h-4 w-4" style={{ color }} />
              <span className="text-sm font-medium w-20">{label}</span>
              <div className="flex-1">
                <Progress 
                  value={percentage} 
                  className="h-2"
                  style={{ 
                    backgroundColor: '#E5E7EB',
                  }}
                />
              </div>
              <span className="text-sm font-bold w-12 text-right">{percentage}%</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Overall Resonance</span>
          <Badge 
            variant={averageScore > 0.7 ? 'default' : averageScore > 0.4 ? 'secondary' : 'destructive'}
            style={{ 
              backgroundColor: averageScore > 0.7 ? COLORS.trust.high : 
                              averageScore > 0.4 ? COLORS.trust.medium : COLORS.trust.low,
              color: 'white'
            }}
          >
            {Math.round(averageScore * 100)}%
          </Badge>
        </div>
      </div>
    </div>
  );
};

// Trust Delta Visualization
const TrustDeltaIndicator: React.FC<{ delta: number; conversionLift: number }> = ({ delta, conversionLift }) => {
  const isPositive = delta > 0;
  const magnitude = Math.abs(delta);
  const color = isPositive ? COLORS.trust.high : COLORS.trust.low;
  
  return (
    <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
      <div className="flex items-center justify-center gap-2 mb-2">
        <TrendingUp className={`h-6 w-6 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
        <span className="text-lg font-bold" style={{ color }}>
          {isPositive ? '+' : ''}{delta.toFixed(2)}
        </span>
      </div>
      <div className="text-sm text-gray-600 mb-1">Trust Improvement</div>
      <div className="text-xs text-gray-500">
        {conversionLift > 0 && `${conversionLift.toFixed(1)}% conversion lift`}
      </div>
    </div>
  );
};

// Main SparkSplit Visualization Component
export const SparkSplitVisualization: React.FC<SparkSplitVisualizationProps> = ({
  data,
  loading = false,
  onUserSelection,
  onEducationalFeedback,
  className = ''
}) => {
  const [selectedOutput, setSelectedOutput] = useState<'sterile' | 'canai' | 'both' | 'neither' | null>(null);
  const [showEducationalPrompt, setShowEducationalPrompt] = useState(false);
  const [educationalFeedback, setEducationalFeedback] = useState('');

  // Handle fallback scenarios
  if (loading) {
    return <FallbackUI reason="loading" />;
  }

  if (!data) {
    return <FallbackUI reason="no-data" />;
  }

  if (!data.emotionalCompass) {
    return <FallbackUI reason="error" />;
  }

  // Calculate sterile emotional compass (lower scores)
  const sterileCompass: EmotionalCompass = {
    awe: Math.max(0, data.emotionalCompass.awe - 0.3),
    ownership: Math.max(0, data.emotionalCompass.ownership - 0.25),
    wonder: Math.max(0, data.emotionalCompass.wonder - 0.35),
    calm: Math.max(0, data.emotionalCompass.calm - 0.2),
    power: Math.max(0, data.emotionalCompass.power - 0.3)
  };

  const handleSelection = (selection: 'sterile' | 'canai' | 'both' | 'neither') => {
    setSelectedOutput(selection);
    onUserSelection?.(selection);
    
    // Show educational prompt after selection
    setTimeout(() => {
      setShowEducationalPrompt(true);
    }, 1000);
  };

  const handleEducationalSubmit = (learned: boolean) => {
    onEducationalFeedback?.(learned, educationalFeedback);
    setShowEducationalPrompt(false);
  };

  return (
    <div className={`w-full max-w-6xl mx-auto space-y-6 ${className}`}>
      {/* Header with Trust Delta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              SparkSplit: Trust Transparency in Action
            </span>
            <Badge variant="outline" className="text-sm">
              Comparison ID: {data.comparisonId.slice(-8)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TrustDeltaIndicator delta={data.trustDelta} conversionLift={data.conversionLift} />
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{Math.round(data.transparencyTrust * 100)}%</div>
              <div className="text-sm text-gray-600">Transparency Trust</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Math.round(data.viralPotential * 100)}%</div>
              <div className="text-sm text-gray-600">Viral Potential</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Output Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sterile Output */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <XCircle className="h-5 w-5" />
              Generic AI Output
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none mb-4">
              <div className="bg-white p-4 rounded border text-gray-700 leading-relaxed">
                {data.sterileOutput}
              </div>
            </div>
            <EmotionalCompassChart 
              compass={sterileCompass} 
              title="Emotional Resonance" 
              variant="sterile"
            />
            <Button
              variant={selectedOutput === 'sterile' ? 'default' : 'outline'}
              className="w-full mt-4"
              onClick={() => handleSelection('sterile')}
            >
              {selectedOutput === 'sterile' ? 'Selected' : 'Choose This Output'}
            </Button>
          </CardContent>
        </Card>

        {/* CanAI Enhanced Output */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-5 w-5" />
              CanAI Enhanced Output
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none mb-4">
              <div className="bg-blue-50 p-4 rounded border border-blue-200 text-gray-800 leading-relaxed">
                {data.enhancedOutput}
              </div>
            </div>
            <EmotionalCompassChart 
              compass={data.emotionalCompass} 
              title="Emotional Resonance" 
              variant="canai"
            />
            <Button
              variant={selectedOutput === 'canai' ? 'default' : 'outline'}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleSelection('canai')}
            >
              {selectedOutput === 'canai' ? 'Selected' : 'Choose This Output'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Selection Options */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedOutput === 'both' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSelection('both')}
            >
              Both are good
            </Button>
            <Button
              variant={selectedOutput === 'neither' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSelection('neither')}
            >
              Neither appeals to me
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUserSelection?.('skip')}
            >
              Skip comparison
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Educational Moment Prompt */}
      {showEducationalPrompt && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Lightbulb className="h-5 w-5" />
              Educational Moment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-green-800">
              Did this comparison help you understand the difference between generic AI and emotionally intelligent AI?
            </p>
            <textarea
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="What did you learn? (optional)"
              value={educationalFeedback}
              onChange={(e) => setEducationalFeedback(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleEducationalSubmit(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Yes, I learned something
              </Button>
              <Button
                variant="outline"
                onClick={() => handleEducationalSubmit(false)}
              >
                No, still unclear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Marketing Analytics (if ready) */}
      {data.marketingReady && (
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <TrendingUp className="h-5 w-5" />
              Marketing Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(data.statisticalSignificance * 100)}%
                </div>
                <div className="text-sm text-purple-700">Statistical Confidence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  +{data.conversionLift.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-700">Conversion Lift</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {data.trustDelta > 0 ? 'WIN' : 'LOSS'}
                </div>
                <div className="text-sm text-purple-700">CanAI vs Generic</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {data.educationalMoment ? 'YES' : 'NO'}
                </div>
                <div className="text-sm text-purple-700">Educational Impact</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SparkSplitVisualization; 