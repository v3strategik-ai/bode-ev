import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Users
} from 'lucide-react';
import { useAuth } from '../../../contexts/messenger/AuthContext';
import { useWebSocket } from '../../../contexts/messenger/WebSocketContext';
import { messengerService } from '../../../services/messengerService';

const ChatInterface = ({ selectedRoom, onRoomSelect }) => {
  const { user } = useAuth();
  const { sendMessage, messages, typingUsers, sendTyping, stopTyping } = useWebSocket();
  const [messageInput, setMessageInput] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load messages when room changes
  useEffect(() => {
    if (selectedRoom) {
      loadRoomMessages();
    }
  }, [selectedRoom]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [roomMessages, messages]);

  const loadRoomMessages = async () => {
    if (!selectedRoom) return;
    
    try {
      setLoading(true);
      const messages = await messengerService.getRoomMessages(selectedRoom.id);
      setRoomMessages(messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return;

    try {
      const messageData = {
        room_id: selectedRoom.id,
        content: messageInput.trim(),
        message_type: 'text'
      };

      // Send via WebSocket for real-time delivery
      sendMessage(selectedRoom.id, messageInput.trim());
      
      // Also send via API for persistence
      await messengerService.sendMessage(messageData);
      
      setMessageInput('');
      stopTyping(selectedRoom.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key !== 'Enter') {
      // Handle typing indicator
      if (!isTyping) {
        setIsTyping(true);
        sendTyping(selectedRoom?.id);
      }

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        stopTyping(selectedRoom?.id);
      }, 2000);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  // Combine API messages and real-time messages
  const allMessages = [...roomMessages, ...messages.filter(m => m.room_id === selectedRoom?.id)];
  const sortedMessages = allMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  if (!selectedRoom) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">Select a chat room</h3>
          <p className="text-gray-500">Choose a room from the sidebar to start messaging</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">
                  {getInitials(selectedRoom.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{selectedRoom.name}</CardTitle>
                <p className="text-sm text-gray-500">
                  {selectedRoom.members?.length || 0} members
                  {typingUsers.size > 0 && ` • ${typingUsers.size} typing...`}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-96 p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              </div>
            ) : sortedMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h4 className="font-semibold mb-2">No messages yet</h4>
                  <p className="text-gray-500">Be the first to send a message!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedMessages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.sender_id === user?.id
                        ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg'
                        : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
                    } px-4 py-2`}>
                      {message.sender_id !== user?.id && (
                        <p className="text-xs font-semibold mb-1">
                          {message.sender_name || message.sender_id}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatMessageTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Typing Indicators */}
          {typingUsers.size > 0 && (
            <div className="px-4 pb-2">
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>{Array.from(typingUsers).join(', ')} typing...</span>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedRoom.name}...`}
                  className="pr-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Smile className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSendMessage} 
                disabled={!messageInput.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;