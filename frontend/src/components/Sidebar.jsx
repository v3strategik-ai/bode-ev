import React from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  Bot, 
  MessageSquare, 
  Target, 
  Briefcase, 
  FileText, 
  Users, 
  BarChart3, 
  Box, 
  Leaf, 
  Mic, 
  Lock, 
  CreditCard, 
  HelpCircle 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', count: 4, active: true },
    { icon: Zap, label: 'Quantum Quoting', count: 5 },
    { icon: Bot, label: 'AI Agents', count: 6 },
    { icon: MessageSquare, label: 'Communications', count: 7 },
    { icon: Target, label: 'Lead Generation', count: 8 },
    { icon: Briefcase, label: 'Opportunities', count: 9 },
    { icon: FileText, label: 'Document Center', count: 10 },
    { icon: Users, label: 'Employee Hub', count: 11 },
    { icon: BarChart3, label: 'Analytics', count: 12 },
    { icon: Box, label: '3D Visualizer', badge: 'NEW' },
    { icon: Leaf, label: 'Carbon Credits', badge: 'NEW' },
    { icon: Mic, label: 'Quantum Voice AI', badge: 'NEW' },
    { icon: Lock, label: 'Blockchain', count: 13 },
    { icon: CreditCard, label: 'Payments', count: 14 },
    { icon: HelpCircle, label: 'Support', count: 15 },
  ];

  return (
    <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 min-h-screen shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-br from-gray-50/50 to-white/30 backdrop-blur-sm">
        <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
          SystemIX AI Platform • Blockchain Secured
        </div>
        <div className="font-bold text-gray-900 text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          CORE MODULES
        </div>
      </div>

      {/* Menu items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                item.active 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500 shadow-lg shadow-blue-100/50 transform scale-[1.02]' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:shadow-lg hover:shadow-gray-100/50 hover:transform hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  item.active
                    ? 'bg-blue-100 text-blue-600 shadow-md'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:shadow-md'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.count && (
                  <span className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                    item.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="text-xs bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-1 rounded-full font-bold shadow-lg shadow-emerald-200/50 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;