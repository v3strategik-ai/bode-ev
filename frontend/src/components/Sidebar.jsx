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
    { icon: Cube, label: '3D Visualizer', badge: 'NEW' },
    { icon: Leaf, label: 'Carbon Credits', badge: 'NEW' },
    { icon: Mic, label: 'Quantum Voice AI', badge: 'NEW' },
    { icon: Lock, label: 'Blockchain', count: 13 },
    { icon: CreditCard, label: 'Payments', count: 14 },
    { icon: HelpCircle, label: 'Support', count: 15 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-sm text-gray-500 mb-2">SystemIX AI Platform • Blockchain Secured</div>
        <div className="font-semibold text-gray-900">CORE MODULES</div>
      </div>

      {/* Menu items */}
      <nav className="p-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex items-center justify-between px-3 py-2 mb-1 rounded-lg cursor-pointer transition-colors ${
                item.active 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.count && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
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