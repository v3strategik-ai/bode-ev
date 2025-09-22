import React from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section - Logo and title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="bg-white text-green-600 px-2 py-1 rounded font-bold text-sm">
              bode
            </div>
            <span className="text-xs opacity-75">Enterprise V4</span>
          </div>
          <div className="border-l border-green-400 pl-4 ml-4">
            <h1 className="text-xl font-bold">BODE EV Enterprise V3</h1>
            <p className="text-sm opacity-90">Your partner in EV charging excellence • Quantum-Powered CRM</p>
          </div>
        </div>

        {/* Center section - Stats */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            <span>99.8% Quantum Accuracy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <span>12 AI Agents Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
            <span>Enterprise Security</span>
          </div>
        </div>

        {/* Right section - Actions and time */}
        <div className="flex items-center space-x-4">
          <div className="text-right text-sm">
            <div className="font-mono text-lg">03:03:34 AM</div>
            <div className="opacity-75">9/22/2025</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
              <Input
                placeholder="Search across all modules"
                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 w-64"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="text-white hover:bg-white/20"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Dark
            </Button>
            
            <div className="text-right">
              <div className="font-semibold">BODE EV Admin</div>
              <div className="text-xs opacity-75">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex items-center space-x-3 mt-4">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <span className="mr-2">+</span>
          Add Lead
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <span className="mr-2">📝</span>
          Create Task
        </Button>
        <Button className="bg-purple-500 hover:bg-purple-600 text-white">
          <span className="mr-2">📊</span>
          Generate Report
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <span className="mr-2">⚙️</span>
          Quick Settings
        </Button>
      </div>
    </header>
  );
};

export default Header;