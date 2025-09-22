import React from 'react';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import ExecutiveDashboard from '../ExecutiveDashboard';

const PerformanceAnalytics = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      <ExecutiveDashboard />
    </div>
  );
};

export default PerformanceAnalytics;