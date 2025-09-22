import React from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 text-white px-6 py-5 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between">
        {/* Left section - Logo and title */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/90 text-emerald-600 px-3 py-1.5 rounded-xl font-bold text-sm backdrop-blur-sm shadow-lg">
              bode
            </div>
            <span className="text-xs opacity-75 font-medium">Enterprise V4</span>
          </div>
          <div className="border-l border-white/20 pl-6 ml-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              BODE EV Enterprise V3
            </h1>
            <p className="text-sm opacity-90 font-medium">Your partner in EV charging excellence • Quantum-Powered CRM</p>
          </div>
        </div>

        {/* Center section - Stats */}
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-pulse shadow-lg shadow-emerald-300/50"></div>
            <span className="font-semibold">99.8% Quantum Accuracy</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-pulse shadow-lg shadow-blue-300/50"></div>
            <span className="font-semibold">12 AI Agents Active</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2.5 h-2.5 bg-amber-300 rounded-full animate-pulse shadow-lg shadow-amber-300/50"></div>
            <span className="font-semibold">Enterprise Security</span>
          </div>
        </div>

        {/* Right section - Actions and time */}
        <div className="flex items-center space-x-6">
          <div className="text-right text-sm bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
            <div className="font-mono text-xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              03:03:34 AM
            </div>
            <div className="opacity-75 text-xs">9/22/2025</div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 h-4 w-4" />
              <Input
                placeholder="Search across all modules"
                className="pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-white/30 text-gray-900 placeholder-gray-500 w-72 rounded-xl shadow-lg focus:shadow-xl transition-all duration-300 focus:bg-white"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="text-white hover:bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:shadow-lg"
            >
              {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              Dark
            </Button>
            
            <div className="text-right bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <div className="font-semibold text-sm">BODE EV Admin</div>
              <div className="text-xs opacity-75">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex items-center space-x-4 mt-6">
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
          <span className="mr-3 text-lg">+</span>
          Add Lead
        </Button>
        <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
          <span className="mr-3">✏️</span>
          Create Task
        </Button>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
          <span className="mr-3">📊</span>
          Generate Report
        </Button>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
          <span className="mr-3">⚙️</span>
          Quick Settings
        </Button>
      </div>
    </header>
  );
};

export default Header;