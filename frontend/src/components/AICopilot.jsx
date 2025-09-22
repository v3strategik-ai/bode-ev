import React, { useState } from 'react';
import { X, Maximize2, Minimize2, Send, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AICopilot = ({ onClose }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [message, setMessage] = useState('');

  const quickActions = [
    { label: 'Find Leads', color: 'bg-red-500', icon: '🎯' },
    { label: 'Generate Quote', color: 'bg-yellow-500', icon: '💰' },
    { label: 'Analytics', color: 'bg-purple-500', icon: '📊' },
    { label: 'System Status', color: 'bg-green-500', icon: '✅' }
  ];

  const automations = [
    { name: 'Lead Scoring', status: 'Active' },
    { name: 'Email Campaigns', status: 'Active' },
    { name: 'Quote Generation', status: 'Active' }
  ];

  return (
    <div className={`bg-gradient-to-b from-blue-600 to-purple-700 text-white ${isMaximized ? 'w-96' : 'w-80'} min-h-screen transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              🤖
            </div>
            <span className="font-semibold">EV AI Copilot</span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 mb-6">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              className={`${action.color} hover:opacity-90 text-white flex items-center space-x-2 h-12 justify-start`}
            >
              <span>{action.icon}</span>
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Welcome Message */}
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Welcome to your Advanced EV AI Copilot!</h3>
          <p className="text-sm opacity-90 mb-3">
            I can assist with commands in 3 languages. 
            Try saying "Find leads" or "Show analytics" 
            or type your message below.
          </p>
          <div className="text-sm">
            <div className="mb-1">Quantum Oracle: <span className="text-green-300">99.7% confidence</span></div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="opacity-75">Voice Accuracy</div>
              <div className="font-semibold">94.2%</div>
            </div>
            <div>
              <div className="opacity-75">Response Time</div>
              <div className="font-semibold">94ms</div>
            </div>
          </div>
        </div>

        {/* Active Automations */}
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-3">Active Automations</h4>
          {automations.map((automation, index) => (
            <div key={index} className="flex justify-between items-center mb-2 last:mb-0">
              <span className="text-sm">{automation.name}</span>
              <span className="text-xs bg-green-500 px-2 py-1 rounded">
                {automation.status}
              </span>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/60"
            />
            <Button
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 right-4">
        <div className="text-xs opacity-60 flex items-center">
          <span className="mr-1">⚡</span>
          Made with Manus
        </div>
      </div>
    </div>
  );
};

export default AICopilot;