import React, { useState } from 'react';
import { Bot, Play, Pause, Settings, Plus, Activity, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const ServiceAutomation = () => {
  const [activeAutomations, setActiveAutomations] = useState(12);

  const automationWorkflows = [
    {
      id: 'WF001',
      name: 'Preventive Maintenance Scheduler',
      description: 'Automatically schedule maintenance based on usage patterns and manufacturer recommendations',
      status: 'active',
      triggers: 847,
      lastRun: '2 hours ago',
      successRate: 98.2,
      type: 'maintenance'
    },
    {
      id: 'WF002',
      name: 'Emergency Response Dispatcher',
      description: 'Auto-dispatch technicians for critical station failures within 2 hours',
      status: 'active',
      triggers: 23,
      lastRun: '1 day ago',
      successRate: 100,
      type: 'emergency'
    },
    {
      id: 'WF003',
      name: 'Customer Notification System',
      description: 'Notify customers about station availability, maintenance schedules, and updates',
      status: 'paused',
      triggers: 1204,
      lastRun: '3 days ago',
      successRate: 94.7,
      type: 'communication'
    },
    {
      id: 'WF004',
      name: 'Usage Analytics Reporter',
      description: 'Generate and distribute weekly usage reports to stakeholders',
      status: 'active',
      triggers: 156,
      lastRun: '6 hours ago',
      successRate: 99.1,
      type: 'reporting'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'maintenance': return '🔧';
      case 'emergency': return '🚨';
      case 'communication': return '📢';
      case 'reporting': return '📊';
      default: return '⚙️';
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bot className="h-8 w-8 mr-3 text-blue-600" />
            Service Automation
          </h1>
          <p className="text-gray-600 mt-2">Automated workflows and intelligent service management</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Automations</p>
                <p className="text-3xl font-bold text-blue-600">{activeAutomations}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Automated</p>
                <p className="text-3xl font-bold text-green-600">2,847</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-green-600">97.8%</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Time Saved</p>
                <p className="text-3xl font-bold text-purple-600">847hrs</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Workflows */}
      <div className="grid gap-6">
        {automationWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(workflow.type)}</span>
                  <div>
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status === 'active' ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                    {workflow.status.toUpperCase()}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{workflow.triggers}</p>
                  <p className="text-sm text-gray-600">Total Triggers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">{workflow.successRate}%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{workflow.lastRun}</p>
                  <p className="text-sm text-gray-600">Last Run</p>
                </div>
                <div className="text-center">
                  <Button size="sm" className={workflow.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}>
                    {workflow.status === 'active' ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Resume
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-blue-900 mb-2">AI Assistant Setup</h3>
            <p className="text-sm text-blue-700">Configure intelligent automation rules and triggers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-green-900 mb-2">Performance Monitor</h3>
            <p className="text-sm text-green-700">Real-time monitoring of automation performance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-purple-900 mb-2">Workflow Builder</h3>
            <p className="text-sm text-purple-700">Create custom automation workflows with drag & drop</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceAutomation;