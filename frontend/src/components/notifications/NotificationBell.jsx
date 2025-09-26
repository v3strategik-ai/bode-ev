import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Trash2, CheckCheck, ExternalLink } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationCenter = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications, removeNotification } = useNotifications();

  const getNotificationIcon = (type, priority) => {
    if (priority === 'critical') return <AlertTriangle className="text-red-500" size={16} />;
    if (priority === 'high') return <AlertTriangle className="text-orange-500" size={16} />;
    if (type === 'ai_alert' || type === 'ai_update') return <span className="text-purple-500">🧠</span>;
    return <Bell className="text-blue-500" size={16} />;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Notifications {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex space-x-2 mt-3">
            <button
              onClick={markAllAsRead}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
            >
              <CheckCheck size={12} />
              Mark All Read
            </button>
            <button
              onClick={clearAllNotifications}
              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 flex items-center gap-1"
            >
              <Trash2 size={12} />
              Clear All
            </button>
          </div>
        )}
      </div>
      
      <div className="overflow-y-auto max-h-80">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell size={32} className="mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type, notification.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                      {notification.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {formatTime(notification.timestamp)}
                    </span>
                    {notification.actionText && (
                      <button className="text-xs text-blue-600 hover:text-blue-800 underline">
                        {notification.actionText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

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