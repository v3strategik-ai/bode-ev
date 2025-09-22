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
    { icon: LayoutDashboard, label: 'Network Dashboard', count: 1247, active: true },
    { icon: Zap, label: 'Charging Stations', count: 856 },
    { icon: Bot, label: 'Service Automation', count: 12 },
    { icon: MessageSquare, label: 'Customer Support', count: 34 },
    { icon: Target, label: 'Site Planning', count: 23 },
    { icon: Briefcase, label: 'Installation Jobs', count: 67 },
    { icon: FileText, label: 'Service Reports', count: 156 },
    { icon: Users, label: 'Technician Hub', count: 89 },
    { icon: BarChart3, label: 'Performance Analytics', count: 15 },
    { icon: Box, label: 'Equipment Inventory', badge: 'NEW' },
    { icon: Leaf, label: 'Sustainability Metrics', badge: 'NEW' },
    { icon: Mic, label: 'Voice Commands', badge: 'BETA' },
    { icon: Lock, label: 'Security Center', count: 3 },
    { icon: CreditCard, label: 'Billing & Payments', count: 412 },
    { icon: HelpCircle, label: 'Support Center', count: 7 },
  ];

  return (
    <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 min-h-screen shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-br from-green-50/50 to-white/30 backdrop-blur-sm">
        <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
          BODE EV Network • Charging Infrastructure
        </div>
        <div className="font-bold text-gray-900 text-lg bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
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
                  ? 'bg-gradient-to-r from-green-50 to-blue-50 text-green-700 border-l-4 border-green-500 shadow-lg shadow-green-100/50 transform scale-[1.02]' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:shadow-lg hover:shadow-gray-100/50 hover:transform hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  item.active
                    ? 'bg-green-100 text-green-600 shadow-md'
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
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className={`text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-pulse ${
                    item.badge === 'NEW' 
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-200/50' 
                      : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-blue-200/50'
                  }`}>
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