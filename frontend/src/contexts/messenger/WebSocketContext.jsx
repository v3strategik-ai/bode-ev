import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef(null);

  const WS_BASE_URL = process.env.REACT_APP_BACKEND_URL 
    ? process.env.REACT_APP_BACKEND_URL.replace('https://', 'wss://').replace('http://', 'ws://')
    : 'wss://evcrm-saas.preview.emergentagent.com';

  const connect = () => {
    if (!isAuthenticated || !user?.id) {
      console.log('Not authenticated, skipping WebSocket connection');
      return;
    }

    try {
      const wsUrl = `${WS_BASE_URL}/api/messenger/ws/${user.id}`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setSocket(newSocket);
        reconnectAttempts.current = 0;
        
        // Send ping to keep connection alive
        const pingInterval = setInterval(() => {
          if (newSocket.readyState === WebSocket.OPEN) {
            newSocket.send(JSON.stringify({ type: 'ping' }));
          } else {
            clearInterval(pingInterval);
          }
        }, 30000); // Ping every 30 seconds
      };

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      newSocket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setSocket(null);
        
        // Attempt reconnection if not a normal closure
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current++;
            console.log(`Reconnection attempt ${reconnectAttempts.current}`);
            connect();
          }, delay);
        }
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close(1000, 'User logged out');
    }
    
    setSocket(null);
    setIsConnected(false);
    setMessages([]);
    setTypingUsers(new Set());
  };

  const handleMessage = (data) => {
    switch (data.type) {
      case 'new_message':
        setMessages(prev => [...prev, data.message]);
        break;
        
      case 'typing':
        setTypingUsers(prev => new Set([...prev, data.user_id]));
        // Remove typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.user_id);
            return newSet;
          });
        }, 3000);
        break;
        
      case 'stop_typing':
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.user_id);
          return newSet;
        });
        break;
        
      case 'video_call_started':
        // Handle video call notification
        console.log('Video call started:', data.call);
        break;
        
      case 'pong':
        // Handle ping response
        break;
        
      default:
        console.log('Unknown message type:', data);
    }
  };

  const sendMessage = (roomId, content, messageType = 'text', attachments = []) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type: 'send_message',
        room_id: roomId,
        content,
        message_type: messageType,
        attachments
      };
      
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  };

  const sendTyping = (roomId) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'typing',
        room_id: roomId
      }));
    }
  };

  const stopTyping = (roomId) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'stop_typing',
        room_id: roomId
      }));
    }
  };

  // Connect when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const value = {
    socket,
    isConnected,
    messages,
    typingUsers,
    sendMessage,
    sendTyping,
    stopTyping,
    connect,
    disconnect
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;