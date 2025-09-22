import React from 'react';
import { FileText, Download, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ServiceReports = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      <div className="flex items-center mb-8">
        <FileText className="h-8 w-8 mr-3 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Reports</h1>
          <p className="text-gray-600">Comprehensive reporting and analytics dashboard</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Generated Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">156</p>
            <p className="text-sm text-gray-600">Reports this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Data Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">2.4M</p>
            <p className="text-sm text-gray-600">Analyzed data points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">847</p>
            <p className="text-sm text-gray-600">Downloads this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceReports;