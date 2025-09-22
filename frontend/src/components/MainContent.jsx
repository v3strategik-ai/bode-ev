import React from 'react';
import { Zap, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import RevenueChart from './charts/RevenueChart';
import MarketSegmentsChart from './charts/MarketSegmentsChart';

const MainContent = () => {
  const kpiCards = [
    {
      title: 'Active Stations',
      value: '1,247',
      change: '+23.4% from last month',
      icon: Zap,
      trend: 'up',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      title: 'Charging Revenue',
      value: '$847K',
      change: '+45.2% from last month',
      icon: DollarSign,
      trend: 'up',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Network Uptime',
      value: '99.8%',
      change: '+87.1% reliability',
      icon: Activity,
      trend: 'up',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50'
    },
    {
      title: 'Service Calls',
      value: '24hr',
      change: 'Average response time',
      icon: TrendingUp,
      trend: 'up',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ];

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50/50 via-white to-green-50/20 min-h-screen">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
              <div className={`h-1 w-full bg-gradient-to-r ${kpi.gradient}`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  {kpi.title}
                </CardTitle>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${kpi.bgGradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <Icon className={`h-6 w-6 bg-gradient-to-br ${kpi.gradient} bg-clip-text text-transparent`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {kpi.value}
                </div>
                <p className={`text-sm font-semibold bg-gradient-to-r ${kpi.gradient} bg-clip-text text-transparent`}>
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {/* Revenue Trend Chart */}
        <div className="col-span-2">
          <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></div>
                Charging Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
        </div>

        {/* Market Segments Chart */}
        <div className="col-span-1">
          <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden h-full">
            <div className="h-1 w-full bg-gradient-to-r from-green-500 to-indigo-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-indigo-500 rounded-full mr-3"></div>
                Station Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarketSegmentsChart />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Response Stats */}
      <div className="grid grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">5min</div>
            <div className="text-sm text-green-700 font-medium">Problem Detection</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2hr</div>
            <div className="text-sm text-blue-700 font-medium">Response Time</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">24hr</div>
            <div className="text-sm text-indigo-700 font-medium">Site Response</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">48hr</div>
            <div className="text-sm text-purple-700 font-medium">Technician Dispatch</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">2hr</div>
            <div className="text-sm text-red-700 font-medium">Station Swap</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainContent;