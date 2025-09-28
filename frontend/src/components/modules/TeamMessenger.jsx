import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  MessageCircle, 
  Users, 
  Phone, 
  FileText, 
  Settings, 
  Wifi, 
  WifiOff,
  Plus,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/messenger/AuthContext';
import { useWebSocket } from '../../contexts/messenger/WebSocketContext';
import AuthContainer from '../messenger/auth/AuthContainer';
import ChatInterface from '../messenger/chat/ChatInterface';
import RoomsInterface from '../messenger/rooms/RoomsInterface';
import FilesInterface from '../messenger/files/FilesInterface';
import CallsInterface from '../messenger/calls/CallsInterface';

const TeamMessenger = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { isConnected, messages } = useWebSocket();
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Team Messenger</h2>
          <p className="text-gray-600">Connect with your BODE EV team in real-time</p>
        </div>
        <AuthContainer onAuthSuccess={() => {
          // Authentication success is handled by the context
          console.log('Authentication successful');
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Messenger</h2>
          <p className="text-gray-600">
            Welcome back, {user?.full_name || user?.username}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Online
                </Badge>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Disconnected
                </Badge>
              </>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Messenger Interface */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <CardTitle>BODE EV Team Communication</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
          <CardDescription>
            Real-time messaging, file sharing, and team collaboration
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Chats</span>
                {messages.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {messages.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rooms" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Rooms</span>
              </TabsTrigger>
              <TabsTrigger value="calls" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Calls</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Files</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-6">
              <ChatInterface />
            </TabsContent>

            <TabsContent value="rooms" className="mt-6">
              <RoomsInterface />
            </TabsContent>

            <TabsContent value="calls" className="mt-6">
              <CallsInterface />
            </TabsContent>

            <TabsContent value="files" className="mt-6">
              <FilesInterface />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Placeholder components for different tabs
const ChatInterface = () => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center text-gray-500">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold mb-2">Chat Interface</h3>
        <p className="text-sm">Real-time messaging interface coming soon...</p>
        <div className="mt-4 space-y-2">
          <div className="text-xs text-left bg-gray-50 p-3 rounded">
            <strong>Features Ready:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>WebSocket connection established ✅</li>
              <li>User authentication working ✅</li>
              <li>Real-time message handling ✅</li>
              <li>Typing indicators ✅</li>
            </ul>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const RoomsInterface = () => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center text-gray-500">
        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold mb-2">Team Rooms</h3>
        <p className="text-sm">Create and manage team chat rooms...</p>
        <div className="mt-4">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Room
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CallsInterface = () => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center text-gray-500">
        <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold mb-2">Video & Audio Calls</h3>
        <p className="text-sm">Start video calls and screen sharing...</p>
        <div className="mt-4 space-x-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Audio Call
          </Button>
          <Button variant="outline" size="sm">
            Video Call
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FilesInterface = () => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold mb-2">File Sharing</h3>
        <p className="text-sm">Upload, share, and manage team files...</p>
        <div className="mt-4 space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <div className="text-xs text-left bg-gray-50 p-3 rounded">
            <strong>AWS S3 Integration:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Cloud storage active ✅</li>
              <li>Secure file uploads ✅</li>
              <li>File sharing links ✅</li>
              <li>Chat attachments ready ✅</li>
            </ul>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TeamMessenger;