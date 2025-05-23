/**
 * @file drift-analytics-dashboard.tsx
 * @purpose Internal admin dashboard for emotional drift monitoring and trust control
 * @codex Provides real-time visibility into system emotional health and recovery effectiveness
 * @version v6.1.4
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, Cell, PieChart, Pie
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, Users, Clock, Zap } from 'lucide-react';

// Types for dashboard data
interface DriftIncident {
  id: string;
  timestamp: string;
  sessionId: string;
  promptId: string;
  requestedTone: string;
  actualTone: string;
  driftScore: number;
  driftCategory: 'none' | 'minor' | 'moderate' | 'severe';
  agentLineage: string[];
  trustImpact: number;
  correctionApplied: boolean;
  recoveryTime?: number;
  status: 'active' | 'resolved' | 'escalated';
}

interface ToneFailurePattern {
  toneType: string;
  failureCount: number;
  avgDriftScore: number;
  commonCauses: string[];
  trend: 'increasing' | 'stable' | 'decreasing';
  lastIncident: string;
}

interface TrustVolatilityData {
  timestamp: string;
  overallTrust: number;
  volatilityScore: number;
  criticalAgents: string[];
  recoveryAttempts: number;
}

interface AgentDriftMetrics {
  agentId: string;
  driftStability: number;
  correctionEffectiveness: number;
  trustImpact: number;
  adaptationRate: number;
  incidentCount: number;
  avgRecoveryTime: number;
  rank: number;
}

interface RecoveryMetrics {
  timestamp: string;
  totalIncidents: number;
  resolvedIncidents: number;
  avgRecoveryTime: number;
  successRate: number;
  fallbackTriggered: number;
  manualIntervention: number;
}

// Mock data generators (would be replaced with real API calls)
const generateMockDriftIncidents = (): DriftIncident[] => {
  const incidents: DriftIncident[] = [];
  const tones = ['professional', 'empathetic', 'confident', 'supportive', 'analytical'];
  const agents = ['strategy-agent', 'content-enhancer', 'emotional-intelligence', 'tone-override-agent'];
  
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
    const requestedTone = tones[Math.floor(Math.random() * tones.length)];
    const driftScore = Math.random();
    
    incidents.push({
      id: `incident-${i}`,
      timestamp,
      sessionId: `session-${Math.floor(Math.random() * 100)}`,
      promptId: `prompt-${Math.floor(Math.random() * 50)}`,
      requestedTone,
      actualTone: driftScore > 0.7 ? 'fallback' : requestedTone,
      driftScore,
      driftCategory: driftScore > 0.7 ? 'severe' : driftScore > 0.5 ? 'moderate' : driftScore > 0.25 ? 'minor' : 'none',
      agentLineage: agents.slice(0, Math.floor(Math.random() * 3) + 1),
      trustImpact: -driftScore * Math.random(),
      correctionApplied: driftScore > 0.3,
      recoveryTime: driftScore > 0.3 ? Math.random() * 5000 : undefined,
      status: Math.random() > 0.8 ? 'escalated' : Math.random() > 0.3 ? 'resolved' : 'active'
    });
  }
  
  return incidents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateMockToneFailures = (): ToneFailurePattern[] => {
  return [
    {
      toneType: 'professional',
      failureCount: 23,
      avgDriftScore: 0.65,
      commonCauses: ['Complex technical content', 'Emotional context mismatch'],
      trend: 'increasing',
      lastIncident: '2 minutes ago'
    },
    {
      toneType: 'empathetic',
      failureCount: 18,
      avgDriftScore: 0.58,
      commonCauses: ['Analytical content', 'Time pressure'],
      trend: 'stable',
      lastIncident: '15 minutes ago'
    },
    {
      toneType: 'confident',
      failureCount: 12,
      avgDriftScore: 0.72,
      commonCauses: ['Uncertainty in content', 'Fallback triggers'],
      trend: 'decreasing',
      lastIncident: '1 hour ago'
    },
    {
      toneType: 'supportive',
      failureCount: 8,
      avgDriftScore: 0.45,
      commonCauses: ['Direct instruction style', 'Technical complexity'],
      trend: 'stable',
      lastIncident: '3 hours ago'
    }
  ];
};

const generateMockTrustVolatility = (): TrustVolatilityData[] => {
  const data: TrustVolatilityData[] = [];
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(Date.now() - i * 60 * 60 * 1000).toISOString();
    data.push({
      timestamp,
      overallTrust: 0.7 + Math.random() * 0.25,
      volatilityScore: Math.random() * 0.4,
      criticalAgents: Math.random() > 0.7 ? ['strategy-agent'] : [],
      recoveryAttempts: Math.floor(Math.random() * 5)
    });
  }
  return data;
};

const generateMockAgentMetrics = (): AgentDriftMetrics[] => {
  const agents = [
    'strategy-agent', 'content-enhancer', 'emotional-intelligence', 
    'tone-override-agent', 'copilot-feedback-agent', 'trust-scorer'
  ];
  
  return agents.map((agentId, index) => ({
    agentId,
    driftStability: 0.6 + Math.random() * 0.35,
    correctionEffectiveness: 0.5 + Math.random() * 0.4,
    trustImpact: Math.random() * 0.3,
    adaptationRate: 0.4 + Math.random() * 0.5,
    incidentCount: Math.floor(Math.random() * 20),
    avgRecoveryTime: 1000 + Math.random() * 4000,
    rank: index + 1
  })).sort((a, b) => b.driftStability - a.driftStability);
};

const generateMockRecoveryMetrics = (): RecoveryMetrics[] => {
  const data: RecoveryMetrics[] = [];
  for (let i = 6; i >= 0; i--) {
    const timestamp = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();
    const totalIncidents = 10 + Math.floor(Math.random() * 20);
    const resolvedIncidents = Math.floor(totalIncidents * (0.7 + Math.random() * 0.25));
    
    data.push({
      timestamp,
      totalIncidents,
      resolvedIncidents,
      avgRecoveryTime: 2000 + Math.random() * 3000,
      successRate: resolvedIncidents / totalIncidents,
      fallbackTriggered: Math.floor(totalIncidents * 0.3),
      manualIntervention: Math.floor(totalIncidents * 0.1)
    });
  }
  return data;
};

// Component for severity badge
const SeverityBadge: React.FC<{ category: string }> = ({ category }) => {
  const colors = {
    none: 'bg-green-100 text-green-800',
    minor: 'bg-yellow-100 text-yellow-800',
    moderate: 'bg-orange-100 text-orange-800',
    severe: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[category as keyof typeof colors]}`}>
      {category.toUpperCase()}
    </span>
  );
};

// Component for trend indicator
const TrendIndicator: React.FC<{ trend: string }> = ({ trend }) => {
  const icons = {
    increasing: <TrendingUp className="w-4 h-4 text-red-500" />,
    stable: <div className="w-4 h-4 bg-yellow-500 rounded-full" />,
    decreasing: <TrendingDown className="w-4 h-4 text-green-500" />
  };
  
  return icons[trend as keyof typeof icons] || null;
};

// Main Dashboard Component
const DriftAnalyticsDashboard: React.FC = () => {
  const [driftIncidents, setDriftIncidents] = useState<DriftIncident[]>([]);
  const [toneFailures, setToneFailures] = useState<ToneFailurePattern[]>([]);
  const [trustVolatility, setTrustVolatility] = useState<TrustVolatilityData[]>([]);
  const [agentMetrics, setAgentMetrics] = useState<AgentDriftMetrics[]>([]);
  const [recoveryMetrics, setRecoveryMetrics] = useState<RecoveryMetrics[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load data on component mount and set up auto-refresh
  useEffect(() => {
    const loadData = () => {
      setDriftIncidents(generateMockDriftIncidents());
      setToneFailures(generateMockToneFailures());
      setTrustVolatility(generateMockTrustVolatility());
      setAgentMetrics(generateMockAgentMetrics());
      setRecoveryMetrics(generateMockRecoveryMetrics());
    };

    loadData();

    if (autoRefresh) {
      const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const activeIncidents = driftIncidents.filter(i => i.status === 'active').length;
    const severeIncidents = driftIncidents.filter(i => i.driftCategory === 'severe').length;
    const avgTrustScore = trustVolatility.length > 0 
      ? trustVolatility[trustVolatility.length - 1].overallTrust 
      : 0;
    const criticalAgents = new Set(trustVolatility.flatMap(t => t.criticalAgents)).size;

    return {
      activeIncidents,
      severeIncidents,
      avgTrustScore,
      criticalAgents
    };
  }, [driftIncidents, trustVolatility]);

  // Prepare heatmap data
  const heatmapData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const agents = ['strategy-agent', 'content-enhancer', 'emotional-intelligence', 'tone-override-agent'];
    
    return hours.map(hour => {
      const data: any = { hour: `${hour}:00` };
      agents.forEach(agent => {
        data[agent] = Math.random() * 0.5; // Volatility score
      });
      return data;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Drift Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time emotional drift monitoring and trust control</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-md ${autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.activeIncidents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Severe Drift</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.severeIncidents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Trust Score</p>
              <p className="text-2xl font-bold text-gray-900">{(summaryStats.avgTrustScore * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Agents</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.criticalAgents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Real-time Drift Incidents */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Real-time Drift Incidents</h2>
            <p className="text-sm text-gray-600">Latest emotional drift events requiring attention</p>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {driftIncidents.slice(0, 10).map((incident) => (
                <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <SeverityBadge category={incident.driftCategory} />
                      <span className="text-sm text-gray-500">
                        {new Date(incident.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      incident.status === 'active' ? 'bg-red-100 text-red-800' :
                      incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {incident.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p><strong>Tone:</strong> {incident.requestedTone} → {incident.actualTone}</p>
                    <p><strong>Drift Score:</strong> {(incident.driftScore * 100).toFixed(1)}%</p>
                    <p><strong>Agents:</strong> {incident.agentLineage.join(', ')}</p>
                    {incident.recoveryTime && (
                      <p><strong>Recovery:</strong> {(incident.recoveryTime / 1000).toFixed(1)}s</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Contributing Tone Failures */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Top Contributing Tone Failures</h2>
            <p className="text-sm text-gray-600">Most problematic tone patterns and their causes</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {toneFailures.map((failure, index) => (
                <div key={failure.toneType} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">#{index + 1} {failure.toneType}</span>
                      <TrendIndicator trend={failure.trend} />
                    </div>
                    <span className="text-sm text-gray-500">{failure.lastIncident}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Failures:</strong> {failure.failureCount}</p>
                      <p><strong>Avg Drift:</strong> {(failure.avgDriftScore * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p><strong>Common Causes:</strong></p>
                      <ul className="text-xs text-gray-600 mt-1">
                        {failure.commonCauses.map((cause, i) => (
                          <li key={i}>• {cause}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Volatility Heatmap */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Trust Volatility Heatmap</h2>
            <p className="text-sm text-gray-600">24-hour agent volatility patterns</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trustVolatility}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
                <YAxis domain={[0, 1]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number, name: string) => [
                    name === 'overallTrust' ? `${(value * 100).toFixed(1)}%` : value.toFixed(3),
                    name === 'overallTrust' ? 'Trust Score' : 'Volatility'
                  ]}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="overallTrust" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Trust Score"
                />
                <Area 
                  type="monotone" 
                  dataKey="volatilityScore" 
                  stackId="2" 
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.6}
                  name="Volatility"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Drift Leaderboard */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Agent Drift Leaderboard</h2>
            <p className="text-sm text-gray-600">Performance ranking by drift stability</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {agentMetrics.map((agent, index) => (
                <div key={agent.agentId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' :
                      'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{agent.agentId}</p>
                      <p className="text-sm text-gray-600">{agent.incidentCount} incidents</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{(agent.driftStability * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">stability</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recovery Effectiveness Over Time */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recovery Effectiveness</h2>
            <p className="text-sm text-gray-600">Success rates and recovery times over the past week</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recoveryMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="left" domain={[0, 1]} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => [
                    name === 'successRate' ? `${(value * 100).toFixed(1)}%` :
                    name === 'avgRecoveryTime' ? `${(value / 1000).toFixed(1)}s` :
                    value,
                    name === 'successRate' ? 'Success Rate' :
                    name === 'avgRecoveryTime' ? 'Avg Recovery Time' :
                    name
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Success Rate"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgRecoveryTime" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Avg Recovery Time"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Drift Category Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Drift Category Distribution</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'None', value: driftIncidents.filter(i => i.driftCategory === 'none').length, fill: '#10B981' },
                    { name: 'Minor', value: driftIncidents.filter(i => i.driftCategory === 'minor').length, fill: '#F59E0B' },
                    { name: 'Moderate', value: driftIncidents.filter(i => i.driftCategory === 'moderate').length, fill: '#F97316' },
                    { name: 'Severe', value: driftIncidents.filter(i => i.driftCategory === 'severe').length, fill: '#EF4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recovery Methods */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recovery Methods</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Automatic Correction</span>
                <span className="text-sm text-gray-900">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Fallback Triggered</span>
                <span className="text-sm text-gray-900">24%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Manual Intervention</span>
                <span className="text-sm text-gray-900">8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* System Health Score */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">System Health Score</h2>
          </div>
          <div className="p-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - summaryStats.avgTrustScore)}`}
                    className="text-blue-600"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {(summaryStats.avgTrustScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">Overall emotional health</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriftAnalyticsDashboard; 