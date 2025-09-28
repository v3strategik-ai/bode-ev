import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { 
  Phone, 
  Video, 
  PhoneCall, 
  Users, 
  Monitor,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '../../../contexts/messenger/AuthContext';
import { messengerService } from '../../../services/messengerService';

const CallsInterface = ({ selectedRoom, onRoomSelect }) => {
  const { user } = useAuth();
  const [activeCall, setActiveCall] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load call history when component mounts
    loadCallHistory();
  }, []);

  const loadCallHistory = async () => {
    // This would typically load from an API endpoint
    // For now, we'll use mock data
    setCallHistory([
      {
        id: '1',
        type: 'video',
        participants: ['John Doe', 'Sarah Johnson'],
        duration: '00:23:45',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: '2', 
        type: 'audio',
        participants: ['Mike Chen'],
        duration: '00:15:30',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'missed'
      },
      {
        id: '3',
        type: 'screen_share',
        participants: ['Emily Rodriguez', 'David Park', 'Lisa Wang'],
        duration: '01:12:20',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'completed'
      }
    ]);
  };

  const handleStartCall = async (callType) => {
    if (!selectedRoom) {
      alert('Please select a room to start a call');
      return;
    }

    try {
      setLoading(true);
      const callData = {
        room_id: selectedRoom.id,
        call_type: callType,
        use_external: false // Use WebRTC by default
      };

      const call = await messengerService.startVideoCall(callData);
      setActiveCall(call);
      
      // In a real implementation, this would initialize WebRTC or Zoom integration
      console.log('Call started:', call);
    } catch (error) {
      console.error('Failed to start call:', error);
      alert('Failed to start call. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    if (!activeCall) return;

    try {
      await messengerService.endVideoCall(activeCall.id);
      setActiveCall(null);
      // Refresh call history
      loadCallHistory();
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const formatDuration = (duration) => {
    return duration || '00:00:00';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getCallIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Phone className="h-4 w-4" />;
      case 'screen_share': return <Monitor className="h-4 w-4" />;
      default: return <PhoneCall className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'missed': return 'bg-red-100 text-red-700';
      case 'ongoing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Call */}
      {activeCall && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Active Call</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getCallIcon(activeCall.call_type)}
                  <span className="font-medium">{activeCall.room_id}</span>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  {activeCall.call_type === 'video' ? 'Video Call' : 
                   activeCall.call_type === 'audio' ? 'Audio Call' : 'Screen Share'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <MicOff className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <VideoOff className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleEndCall}
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Start New Call</CardTitle>
          <CardDescription>
            {selectedRoom ? `Start a call in ${selectedRoom.name}` : 'Select a room to start a call'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => handleStartCall('audio')} 
              disabled={loading || !selectedRoom || activeCall}
              className="flex items-center justify-center space-x-2 h-20"
            >
              <Phone className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">Audio Call</div>
                <div className="text-sm opacity-75">Voice only</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => handleStartCall('video')} 
              disabled={loading || !selectedRoom || activeCall}
              className="flex items-center justify-center space-x-2 h-20"
            >
              <Video className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">Video Call</div>
                <div className="text-sm opacity-75">Audio & video</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => handleStartCall('screen_share')} 
              disabled={loading || !selectedRoom || activeCall}
              variant="outline"
              className="flex items-center justify-center space-x-2 h-20"
            >
              <Monitor className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">Screen Share</div>
                <div className="text-sm opacity-75">Share your screen</div>
              </div>
            </Button>
          </div>
          
          {!selectedRoom && (
            <p className="text-center text-gray-500 mt-4">
              Select a chat room to enable calling features
            </p>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Video Conferencing</h4>
              <p className="text-sm text-gray-600">Integration status</p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-700">WebRTC Ready</Badge>
                <Badge variant="outline">Zoom Integration Available</Badge>
              </div>
              <p className="text-xs text-gray-500">Add Zoom API keys for external meetings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Recent Calls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {callHistory.length === 0 ? (
            <div className="text-center p-8">
              <PhoneCall className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h4 className="font-semibold mb-2">No calls yet</h4>
              <p className="text-gray-500">Your call history will appear here</p>
            </div>
          ) : (
            <div className="divide-y">
              {callHistory.map((call) => (
                <div key={call.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(call.status)}`}>
                        {getCallIcon(call.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">
                            {call.type === 'video' ? 'Video Call' : 
                             call.type === 'audio' ? 'Audio Call' : 'Screen Share'}
                          </h4>
                          <Badge variant="outline" className={getStatusColor(call.status)}>
                            {call.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          with {call.participants.join(', ')}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>Duration: {call.duration}</span>
                          <span>{formatTimestamp(call.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Back
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CallsInterface;