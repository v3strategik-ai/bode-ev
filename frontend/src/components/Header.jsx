import React from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left section - BODE EV Logo and title */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-baseline space-x-1">
              <span className="bg-white text-green-600 px-3 py-1.5 rounded-xl font-bold text-lg lowercase">
                bode
              </span>
              <span className="bg-blue-600 text-white px-2 py-1.5 rounded-lg font-bold text-sm uppercase tracking-wider">
                EV
              </span>
            </div>
            <span className="text-xs opacity-75 font-medium">Enterprise V3</span>
          </div>
          <div className="border-l border-white/20 pl-6 ml-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              BODE EV Enterprise V3
            </h1>
            <p className="text-sm opacity-90 font-medium">EV charging that just works • Quantum-Powered CRM</p>
          </div>
        </div>

        {/* Center section - Stats */}
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse shadow-lg shadow-green-300/50"></div>
            <span className="font-semibold">99.8% Platform Uptime</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-pulse shadow-lg shadow-blue-300/50"></div>
            <span className="font-semibold">77.3% Success Rate</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2.5 h-2.5 bg-yellow-300 rounded-full animate-pulse shadow-lg shadow-yellow-300/50"></div>
            <span className="font-semibold">59M+ EV Miles</span>
          </div>
        </div>

        {/* Right section - Actions and time */}
        <div className="flex items-center space-x-6">
          <div className="text-right text-sm bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
            <div className="font-mono text-xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              03:03:34 AM
            </div>
            <div className="opacity-75 text-xs">9/22/2025</div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
              <Input
                placeholder="Search charging networks"
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
              <div className="text-xs opacity-75">Network Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex items-center space-x-4 mt-6">
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
          <span className="mr-3 text-lg">+</span>
          Add Charging Station
        </Button>
        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
          <span className="mr-3">⚡</span>
          Schedule Service
        </Button>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
          <span className="mr-3">📊</span>
          Generate Report
        </Button>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
          <span className="mr-3">⚙️</span>
          System Settings
        </Button>
      </div>
    </header>
  );
};

export default Header;