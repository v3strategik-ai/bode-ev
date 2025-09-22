import React from 'react';
import { Leaf, Zap, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const SustainabilityMetrics = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      <div className="flex items-center mb-8">
        <Leaf className="h-8 w-8 mr-3 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sustainability Metrics</h1>
          <p className="text-gray-600">Environmental impact and carbon footprint tracking</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              CO₂ Avoided
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">847 tons</p>
            <p className="text-sm text-gray-600">This quarter</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Clean Energy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">2.4 GWh</p>
            <p className="text-sm text-gray-600">Renewable energy used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="h-5 w-5 mr-2" />
              Green Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">94.2%</p>
            <p className="text-sm text-gray-600">Sustainability rating</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SustainabilityMetrics;