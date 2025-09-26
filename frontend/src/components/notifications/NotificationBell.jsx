import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationCenter from './NotificationSystem';

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [showCenter, setShowCenter] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate bell when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const toggleNotificationCenter = () => {
    setShowCenter(!showCenter);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={toggleNotificationCenter}
          className={`
            relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 
            rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isAnimating ? 'animate-bounce' : ''}
          `}
          aria-label="Notifications"
        >
          <Bell size={20} />
          
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          
          {/* Pulsing indicator for new notifications */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-5 w-5 animate-ping opacity-75"></span>
          )}
        </button>
        
        {/* Notification Center */}
        {showCenter && (
          <div className="fixed top-16 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            <NotificationCenter onClose={() => setShowCenter(false)} />
          </div>
        )}
      </div>
      
      {/* Overlay to close notification center */}
      {showCenter && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCenter(false)}
        ></div>
      )}
    </>
  );
};

export default NotificationBell;