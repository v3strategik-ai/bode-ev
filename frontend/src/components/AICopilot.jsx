import React, { useState } from 'react';
import { X, Maximize2, Minimize2, Send, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AICopilot = ({ onClose }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [message, setMessage] = useState('');

  const quickActions = [
    { label: 'Find Leads', color: 'from-red-500 to-pink-500', icon: '🎯' },
    { label: 'Generate Quote', color: 'from-yellow-400 to-orange-500', icon: '💰' },
    { label: 'Analytics', color: 'from-purple-500 to-indigo-600', icon: '📊' },
    { label: 'System Status', color: 'from-green-500 to-emerald-500', icon: '✅' }
  ];

  const automations = [
    { name: 'Lead Scoring', status: 'Active' },
    { name: 'Email Campaigns', status: 'Active' },
    { name: 'Quote Generation', status: 'Active' }
  ];

  return (
    <div className={`bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 text-white ${isMaximized ? 'w-96' : 'w-80'} min-h-screen transition-all duration-500 shadow-2xl border-l border-white/10 backdrop-blur-xl`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
              🤖
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">EV AI Copilot</span>
              <div className="text-xs opacity-75">Powered by Quantum AI</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3 mb-8">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              className={`bg-gradient-to-r ${action.color} hover:shadow-xl text-white flex items-center space-x-2 h-14 justify-start rounded-2xl border-0 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm`}
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-sm font-semibold">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Welcome Message */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
          <h3 className="font-bold mb-3 text-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Welcome to your Advanced EV AI Copilot!
          </h3>
          <p className="text-sm opacity-90 mb-4 leading-relaxed">
            I can assist with commands in 3 languages. 
            Try saying "Find leads" or "Show analytics" 
            or type your message below.
          </p>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-sm flex items-center justify-between">
              <span>Quantum Oracle:</span>
              <span className="text-emerald-300 font-bold">99.7% confidence</span>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
          <h4 className="font-bold mb-4 text-white">Performance Metrics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Voice Accuracy</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-bold text-emerald-300">94.2%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Response Time</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-[96%] h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                </div>
                <span className="text-sm font-bold text-blue-300">94ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Automations */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
          <h4 className="font-bold mb-4 text-white">Active Automations</h4>
          <div className="space-y-3">
            {automations.map((automation, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-sm font-medium">{automation.name}</span>
                <span className="text-xs bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                  {automation.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex space-x-3">
            <Input
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/60 rounded-2xl backdrop-blur-sm focus:bg-white/15 transition-all duration-300"
            />
            <Button
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white rounded-2xl px-4 border border-white/20 transition-all duration-300"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl px-4 border-0 shadow-lg transition-all duration-300"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 right-6">
        <div className="text-xs opacity-60 flex items-center bg-white/5 px-3 py-2 rounded-full backdrop-blur-sm border border-white/10">
          <span className="mr-2">⚡</span>
          Made with Manus
        </div>
      </div>
    </div>
  );
};

export default AICopilot;