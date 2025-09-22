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
      trend: 'up'
    },
    {
      title: 'Quantum Revenue',
      value: '$847K',
      change: '+45.2% from last month',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'AI Predictions',
      value: '342',
      change: '+87.1% from last month',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: 'Install Projects',
      value: '89',
      change: '+34.2% from last month',
      icon: Wrench,
      trend: 'up'
    }
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {kpi.value}
                </div>
                <p className="text-sm text-green-600 font-medium">
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
        </div>

        {/* Market Segments Chart */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Market Segments</CardTitle>
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