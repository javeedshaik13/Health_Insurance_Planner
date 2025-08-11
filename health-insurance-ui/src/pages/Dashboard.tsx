
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, Loader2 } from 'lucide-react';
import { api } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await api.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
      // Use fallback data if API fails
      setDashboardData(getFallbackData());
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackData = () => ({
    currentPremium: 45200,
    claimsThisYear: 3,
    familyMembers: 4,
    healthScore: 85,
    monthlyTrend: [
      { month: 'Jan', value: 4500 },
      { month: 'Feb', value: 4200 },
      { month: 'Mar', value: 4800 },
      { month: 'Apr', value: 4300 },
      { month: 'May', value: 4600 },
      { month: 'Jun', value: 4400 },
    ],
    healthTrend: [
      { month: 1, score: 82 },
      { month: 2, score: 78 },
      { month: 3, score: 85 },
      { month: 4, score: 80 },
      { month: 5, score: 88 },
      { month: 6, score: 85 },
    ],
    premiumChange: '+2.5',
    totalPredictions: 12
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const data = dashboardData || getFallbackData();

  // Dynamic stats based on real data
  const stats = [
    {
      title: 'Current Premium',
      value: `₹${data.currentPremium?.toLocaleString() || '0'}`,
      change: `${data.premiumChange > 0 ? '+' : ''}${data.premiumChange}%`,
      icon: DollarSign,
      color: data.premiumChange >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Claims This Year',
      value: data.claimsThisYear?.toString() || '0',
      change: data.claimsThisYear <= 2 ? 'Low activity' : 'Active year',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      title: 'Family Members',
      value: data.familyMembers?.toString() || '1',
      change: 'All covered',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Health Score',
      value: `${data.healthScore || 85}/100`,
      change: `${data.healthScore >= 80 ? 'Excellent' : data.healthScore >= 70 ? 'Good' : 'Needs attention'}`,
      icon: TrendingUp,
      color: data.healthScore >= 80 ? 'text-green-600' : data.healthScore >= 70 ? 'text-yellow-600' : 'text-red-600'
    }
  ];

  // Dynamic chart data
  const monthlyData = data.monthlyTrend?.map((item: any) => ({
    month: item.month,
    cost: item.value,
    claims: Math.floor(Math.random() * 3) + 1 // Mock claims data
  })) || [];

  const healthTrendData = data.healthTrend?.map((item: any) => ({
    month: `Month ${item.month}`,
    score: item.score
  })) || [];

  const riskDistribution = [
    {
      name: 'Low Risk',
      value: data.healthScore >= 80 ? 70 : data.healthScore >= 70 ? 50 : 30,
      color: '#10b981'
    },
    {
      name: 'Medium Risk',
      value: data.healthScore >= 80 ? 25 : data.healthScore >= 70 ? 35 : 40,
      color: '#f59e0b'
    },
    {
      name: 'High Risk',
      value: data.healthScore >= 80 ? 5 : data.healthScore >= 70 ? 15 : 30,
      color: '#ef4444'
    },
  ];

  // Dynamic health metrics based on latest prediction
  const latestPrediction = data.recentPredictions?.[0];
  const healthMetrics = [
    {
      name: 'Age',
      value: latestPrediction?.inputData?.age || user?.age || 'N/A'
    },
    {
      name: 'BMI Category',
      value: latestPrediction?.inputData?.bmiCategory || 'Normal'
    },
    {
      name: 'Smoking Status',
      value: latestPrediction?.inputData?.smokingStatus || 'Non-smoker'
    },
    {
      name: 'Medical History',
      value: latestPrediction?.inputData?.medicalHistory || 'No Disease'
    },
    {
      name: 'Genetic Risk',
      value: latestPrediction?.inputData?.geneticalRisk || 0
    },
    {
      name: 'Total Predictions',
      value: data.totalPredictions || 0
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user?.firstName ? `${user.firstName}'s Health Dashboard` : 'Health Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Track your health metrics and insurance analytics</p>
            {error && (
              <p className="text-red-600 text-sm mt-2">
                {error} - Showing fallback data
              </p>
            )}
          </div>
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            <span>Refresh</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-100`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Costs Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Insurance Costs</CardTitle>
              <CardDescription>Track your insurance spending over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Health Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Health Trend</CardTitle>
              <CardDescription>Your health score progression</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[60, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Health Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics</CardTitle>
              <CardDescription>Current health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                    <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Current risk distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {riskDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span>{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Predictions</CardTitle>
              <CardDescription>Your latest insurance cost predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentPredictions?.length > 0 ? (
                  data.recentPredictions.slice(0, 4).map((prediction: any, index: number) => (
                    <div key={prediction._id || index} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        prediction.prediction > 50000 ? 'bg-red-500' :
                        prediction.prediction > 30000 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          ₹{prediction.prediction?.toLocaleString()} prediction
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(prediction.createdAt).toLocaleDateString()} •
                          Age: {prediction.inputData?.age}, Plan: {prediction.inputData?.insurancePlan}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No predictions yet</p>
                    <p className="text-xs text-gray-400">Make your first prediction to see data here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
