import React from 'react';
import { Mic, Volume2, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const VoiceCommands = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      <div className="flex items-center mb-8">
        <Mic className="h-8 w-8 mr-3 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voice Commands</h1>
          <p className="text-gray-600">AI-powered voice control and automation (BETA)</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="h-5 w-5 mr-2" />
              Voice Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">96.8%</p>
            <p className="text-sm text-gray-600">Accuracy rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="h-5 w-5 mr-2" />
              Commands Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">12,847</p>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">234</p>
            <p className="text-sm text-gray-600">Using voice features</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceCommands;