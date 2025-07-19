import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Moon, Zap, Heart } from 'lucide-react';
import garminApi from '../services/garminApi.js';

const Insights = () => {
  const [hrvData, setHrvData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [stressData, setStressData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadInsightsData();
  }, [timeRange]);

  const loadInsightsData = async () => {
    setLoading(true);
    try {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      
      const [hrv, sleep, stress, activity] = await Promise.all([
        garminApi.getHrvHistory(days),
        garminApi.getSleepHistory(days),
        garminApi.getStressHistory(days),
        garminApi.getActivityData(days)
      ]);

      setHrvData(hrv);
      setSleepData(sleep);
      setStressData(stress);
      setActivityData(activity);
    } catch (error) {
      console.error('Error loading insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getHrvTrend = () => {
    if (hrvData.length < 2) return null;
    const recent = hrvData.slice(-3).reduce((sum, d) => sum + d.hrv, 0) / 3;
    const previous = hrvData.slice(-6, -3).reduce((sum, d) => sum + d.hrv, 0) / 3;
    return recent > previous ? 'up' : 'down';
  };

  const getSleepQualityDistribution = () => {
    if (!sleepData.length) return [];
    
    const avgSleep = sleepData[sleepData.length - 1];
    return [
      { name: 'Deep Sleep', value: avgSleep.deep, color: '#7ACFD6' },
      { name: 'REM Sleep', value: avgSleep.rem, color: '#C4FF61' },
      { name: 'Light Sleep', value: avgSleep.light, color: '#F2C6C2' }
    ];
  };

  const getInsightCards = () => {
    const hrvTrend = getHrvTrend();
    const avgStress = stressData.length ? 
      stressData.reduce((sum, d) => sum + d.stress, 0) / stressData.length : 0;
    const avgSleep = sleepData.length ?
      sleepData.reduce((sum, d) => sum + d.score, 0) / sleepData.length : 0;

    return [
      {
        title: 'HRV Trend',
        value: hrvTrend === 'up' ? 'Improving' : 'Declining',
        icon: hrvTrend === 'up' ? TrendingUp : TrendingDown,
        color: hrvTrend === 'up' ? 'undo-text-detox-green' : 'undo-text-dusty-rose',
        description: 'Your recovery is trending ' + (hrvTrend === 'up' ? 'upward' : 'downward')
      },
      {
        title: 'Sleep Quality',
        value: Math.round(avgSleep),
        icon: Moon,
        color: 'undo-text-recovery-blue',
        description: 'Average sleep score this week'
      },
      {
        title: 'Stress Level',
        value: Math.round(avgStress),
        icon: Zap,
        color: avgStress < 30 ? 'undo-text-detox-green' : 'undo-text-dusty-rose',
        description: 'Average stress level'
      }
    ];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold undo-text-charcoal">Health Insights</h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold undo-text-charcoal">Health Insights</h2>
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "undo-bg-recovery-blue text-white" : ""}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 gap-4">
        {getInsightCards().map((insight, index) => (
          <Card key={index} className="health-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <insight.icon className={`w-5 h-5 ${insight.color}`} />
                    <span className="text-sm font-medium">{insight.title}</span>
                  </div>
                  <div className="mt-1">
                    <div className="text-2xl font-bold">{insight.value}</div>
                    <div className="text-xs text-gray-500">{insight.description}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* HRV Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 undo-text-recovery-blue" />
            <span>HRV Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hrvData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => formatDate(value)}
                formatter={(value) => [value.toFixed(1), 'HRV']}
              />
              <Line 
                type="monotone" 
                dataKey="hrv" 
                stroke="var(--undo-recovery-blue)" 
                strokeWidth={2}
                dot={{ fill: 'var(--undo-recovery-blue)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sleep Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="w-5 h-5 undo-text-recovery-blue" />
            <span>Sleep Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sleep Score Trend */}
            <div>
              <h4 className="text-sm font-medium mb-2">Sleep Score Trend</h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={sleepData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    fontSize={10}
                  />
                  <YAxis fontSize={10} />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value) => [Math.round(value), 'Score']}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="var(--undo-recovery-blue)"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sleep Composition */}
            <div>
              <h4 className="text-sm font-medium mb-2">Sleep Composition</h4>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={getSleepQualityDistribution()}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getSleepQualityDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toFixed(1) + 'h', '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {getSleepQualityDistribution().map((item, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}: {item.value.toFixed(1)}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stress & Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 undo-text-detox-green" />
            <span>Stress & Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => formatDate(value)}
                formatter={(value) => [Math.round(value), 'Stress Level']}
              />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="var(--undo-dusty-rose)" 
                strokeWidth={2}
                dot={{ fill: 'var(--undo-dusty-rose)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 undo-bg-detox-green rounded-lg">
            <h4 className="font-medium text-black">Recovery Focus</h4>
            <p className="text-sm text-gray-700">Your HRV is trending well. Consider maintaining your current sleep schedule and stress management routine.</p>
          </div>
          <div className="p-3 undo-bg-recovery-blue rounded-lg">
            <h4 className="font-medium text-white">Sleep Optimization</h4>
            <p className="text-sm text-blue-100">Try taking magnesium 30 minutes before bed to improve deep sleep quality.</p>
          </div>
          <div className="p-3 undo-bg-dusty-rose rounded-lg">
            <h4 className="font-medium text-black">Menopause Support</h4>
            <p className="text-sm text-gray-700">Consider tracking hot flashes in relation to your stress levels to identify patterns.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Insights;

