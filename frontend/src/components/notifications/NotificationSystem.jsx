import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ExternalLink,
  Trash2,
  CheckCheck
} from 'lucide-react';

// Toast Notification Component (for low/medium priority)
const ToastNotification = ({ notification, onClose, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(notification.id), 300);
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'low':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-gray-200 bg-white text-gray-800';
    }
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm w-full
      transform transition-all duration-300 ease-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`
        border rounded-lg shadow-lg p-4 backdrop-blur-sm
        ${getPriorityStyles(notification.priority)}
      `}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 text-2xl">
            {notification.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold">{notification.title}</h3>
            <p className="text-xs mt-1 opacity-90">{notification.message}</p>
            {notification.actionText && (
              <button
                onClick={() => onAction(notification)}
                className="text-xs underline mt-2 hover:no-underline flex items-center gap-1"
              >
                {notification.actionText}
                <ExternalLink size={10} />
              </button>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-black/10 rounded"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Alert Banner Component (for high priority)
const AlertBanner = ({ notification, onClose, onAction }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-orange-100 border-b-2 border-orange-300 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-orange-800">
                {notification.icon} {notification.title}
              </h3>
              <p className="text-xs text-orange-700">{notification.message}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {notification.actionText && (
              <button
                onClick={() => onAction(notification)}
                className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-orange-700 flex items-center gap-1"
              >
                {notification.actionText}
                <ExternalLink size={12} />
              </button>
            )}
            <button
              onClick={() => onClose(notification.id)}
              className="text-orange-600 hover:text-orange-800 p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Critical Alert Modal (for critical priority)
const CriticalAlertModal = ({ notification, onClose, onAction }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 border-red-200">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-shrink-0 p-3 bg-red-100 rounded-full">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800">
                {notification.icon} {notification.title}
              </h3>
              <p className="text-sm text-red-700 mt-1">{notification.message}</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-red-600">
              <strong>Immediate Action Required:</strong> This alert requires your attention now.
            </p>
          </div>
          
          <div className="flex space-x-3">
            {notification.actionText && (
              <button
                onClick={() => onAction(notification)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2"
              >
                {notification.actionText}
                <ExternalLink size={16} />
              </button>
            )}
            <button
              onClick={() => onClose(notification.id)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Center Panel
const NotificationCenter = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-60 max-h-96 overflow-hidden">
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
    </div>
  );
};

// Main Notification System Component
const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotifications();
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState([]);

  // Handle notification display based on priority
  useEffect(() => {
    const criticalNotifications = notifications.filter(n => n.priority === 'critical');
    const highNotifications = notifications.filter(n => n.priority === 'high');
    const otherNotifications = notifications.filter(n => ['low', 'medium'].includes(n.priority));

    // Show only the most recent notification of each type
    const toShow = [];
    if (criticalNotifications.length > 0) toShow.push(criticalNotifications[0]);
    else if (highNotifications.length > 0) toShow.push(highNotifications[0]);
    else if (otherNotifications.length > 0) toShow.push(otherNotifications[0]);

    setActiveNotifications(toShow);
  }, [notifications]);

  const handleNotificationAction = (notification) => {
    if (notification.actionUrl) {
      // Handle navigation to the specified URL/section
      if (notification.actionUrl.startsWith('#')) {
        const element = document.querySelector(notification.actionUrl);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = notification.actionUrl;
      }
    }
    removeNotification(notification.id);
  };

  return (
    <>
      {/* Render active notifications based on priority */}
      {activeNotifications.map((notification) => {
        if (notification.priority === 'critical') {
          return (
            <CriticalAlertModal
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
              onAction={handleNotificationAction}
            />
          );
        } else if (notification.priority === 'high') {
          return (
            <AlertBanner
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
              onAction={handleNotificationAction}
            />
          );
        } else {
          return (
            <ToastNotification
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
              onAction={handleNotificationAction}
            />
          );
        }
      })}

      {/* Notification Center Panel */}
      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />
    </>
  );
};

export default NotificationSystem;