import React from 'react';
import { Users, DollarSign, TrendingUp, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import RevenueChart from './charts/RevenueChart';
import MarketSegmentsChart from './charts/MarketSegmentsChart';

const MainContent = () => {
  const kpiCards = [
    {
      title: 'Active Leads',
      value: '47',
      change: '+23.4% from last month',
      icon: Users,
      trend: 'up',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Quantum Revenue',
      value: '$847K',
      change: '+45.2% from last month',
      icon: DollarSign,
      trend: 'up',
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50'
    },
    {
      title: 'AI Predictions',
      value: '342',
      change: '+87.1% from last month',
      icon: TrendingUp,
      trend: 'up',
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50'
    },
    {
      title: 'Install Projects',
      value: '89',
      change: '+34.2% from last month',
      icon: Wrench,
      trend: 'up',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ];

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
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
      <div className="grid grid-cols-3 gap-8">
        {/* Revenue Trend Chart */}
        <div className="col-span-2">
          <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-blue-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full mr-3"></div>
                Revenue Trend
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
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
                Market Segments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarketSegmentsChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MainContent;