import React, { useState } from 'react';
import { X, Maximize2, Minimize2, Send, Mic, MessageSquare, Bot, Zap, Calendar, FileText, BarChart3, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const FloatingCopilot = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { type: 'assistant', content: 'Hi! I\'m your EV Charging Assistant. I can help automate your workflows, manage charging stations, schedule maintenance, and analyze performance data. What would you like me to help with today?' }
  ]);

  const automationActions = [
    { label: 'Auto-Schedule Maintenance', icon: Calendar, color: 'from-blue-500 to-blue-600', description: 'Set up automated maintenance scheduling based on usage patterns' },
    { label: 'Generate Performance Reports', icon: BarChart3, color: 'from-green-500 to-green-600', description: 'Create automated weekly/monthly performance reports' },
    { label: 'Monitor Station Health', icon: Zap, color: 'from-yellow-500 to-orange-500', description: 'Real-time monitoring and alert automation' },
    { label: 'Workflow Automation', icon: Settings, color: 'from-purple-500 to-indigo-600', description: 'Create custom automated workflows for your operations' }
  ];

  const quickActions = [
    { label: 'Station Status', icon: '🔋' },
    { label: 'Service Tickets', icon: '🔧' },
    { label: 'Analytics', icon: '📊' },
    { label: 'Alerts', icon: '🚨' }
  ];

  const workflowTemplates = [
    { name: 'Maintenance Reminder', status: 'Active', description: 'Sends alerts 24hrs before scheduled maintenance' },
    { name: 'Usage Analytics', status: 'Active', description: 'Weekly usage reports sent to stakeholders' },
    { name: 'Emergency Response', status: 'Active', description: 'Automatic technician dispatch for critical failures' },
    { name: 'Customer Notifications', status: 'Paused', description: 'Notify users about station availability changes' }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, 
        { type: 'user', content: message },
        { type: 'assistant', content: 'I understand you want help with that. Let me process your request and provide the best solution for your EV charging operations.' }
      ]);
      setMessage('');
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-110 border-0 group"
        >
          <Bot className="h-8 w-8 group-hover:animate-pulse" />
        </Button>
        <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          EV Automation Assistant
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-gray-200 transition-all duration-500 ${
      isMaximized ? 'w-[500px] h-[700px]' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-t-3xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-lg">EV Automation Assistant</span>
              <div className="text-xs opacity-90">Powered by BODE AI</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-xl transition-all duration-300"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-xl transition-all duration-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-[calc(100%-80px)]">
        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-12 flex flex-col items-center justify-center space-y-1 hover:bg-green-50 hover:border-green-200 transition-all duration-300"
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Automation Actions */}
        <div className="p-4 border-b border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Workflow Automation</h4>
          <div className="space-y-2">
            {automationActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  className={`w-full bg-gradient-to-r ${action.color} hover:opacity-90 text-white p-3 rounded-xl border-0 transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">{action.label}</div>
                      <div className="text-xs opacity-90">{action.description}</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Active Workflows */}
        <div className="p-4 border-b border-gray-100 flex-1 overflow-y-auto">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Active Workflows</h4>
          <div className="space-y-2">
            {workflowTemplates.map((workflow, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-300">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm text-gray-900">{workflow.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    workflow.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {workflow.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{workflow.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-2xl ${
                msg.type === 'user' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <Input
              placeholder="Describe the workflow you want to automate..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 rounded-xl border-gray-200 focus:border-green-500 transition-all duration-300"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-4 border-0 transition-all duration-300"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCopilot;