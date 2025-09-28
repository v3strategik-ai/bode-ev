import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { 
  Plus, 
  Users, 
  Lock, 
  Globe, 
  MessageCircle, 
  MoreVertical,
  Settings,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../../contexts/messenger/AuthContext';
import { messengerService } from '../../../services/messengerService';

const RoomsInterface = ({ selectedRoom, onRoomSelect }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    type: 'public'
  });

  useEffect(() => {
    loadUserRooms();
  }, []);

  const loadUserRooms = async () => {
    try {
      setLoading(true);
      const userRooms = await messengerService.getUserRooms();
      setRooms(userRooms);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoom.name.trim()) return;

    try {
      const roomData = {
        name: newRoom.name.trim(),
        description: newRoom.description.trim(),
        type: newRoom.type,
        members: [] // Start with just the creator
      };

      const createdRoom = await messengerService.createRoom(roomData);
      setRooms(prev => [...prev, createdRoom]);
      setCreateModalOpen(false);
      setNewRoom({ name: '', description: '', type: 'public' });
      
      // Auto-select the newly created room
      onRoomSelect(createdRoom);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await messengerService.joinRoom(roomId);
      await loadUserRooms(); // Refresh the list
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const handleLeaveRoom = async (roomId) => {
    try {
      await messengerService.leaveRoom(roomId);
      setRooms(prev => prev.filter(room => room.id !== roomId));
      
      // If leaving the selected room, clear selection
      if (selectedRoom?.id === roomId) {
        onRoomSelect(null);
      }
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const getRoomIcon = (room) => {
    return room.type === 'private' ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading rooms...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Team Rooms</h3>
          <p className="text-gray-600">Organize conversations by project or team</p>
        </div>
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
              <DialogDescription>
                Set up a new chat room for your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="room-name">Room Name</Label>
                <Input
                  id="room-name"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Tesla Project Team"
                />
              </div>
              <div>
                <Label htmlFor="room-description">Description (Optional)</Label>
                <Textarea
                  id="room-description"
                  value={newRoom.description}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the room's purpose"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="room-type">Room Type</Label>
                <Select 
                  value={newRoom.type} 
                  onValueChange={(value) => setNewRoom(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Public - Anyone can join</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Private - Invitation only</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRoom} disabled={!newRoom.name.trim()}>
                  Create Room
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rooms List */}
      <div className="grid gap-4">
        {rooms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h4 className="font-semibold mb-2">No rooms yet</h4>
              <p className="text-gray-500 mb-4">Create your first team room to get started</p>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          rooms.map((room) => (
            <Card 
              key={room.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRoom?.id === room.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onRoomSelect(room)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Avatar>
                      <AvatarFallback className={`${
                        room.type === 'private' ? 'bg-orange-600' : 'bg-blue-600'
                      } text-white`}>
                        {getInitials(room.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold truncate">{room.name}</h4>
                        {getRoomIcon(room)}
                        <Badge variant={room.type === 'private' ? 'secondary' : 'outline'}>
                          {room.type}
                        </Badge>
                      </div>
                      {room.description && (
                        <p className="text-sm text-gray-500 truncate">{room.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{room.members?.length || 0} members</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>Active</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Room Actions */}
                  <div className="flex items-center space-x-2">
                    {room.created_by === user?.id ? (
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveRoom(room.id);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Sample Rooms to Join */}
      <div className="mt-8">
        <h4 className="text-md font-semibold mb-4">Suggested Rooms</h4>
        <div className="grid gap-3">
          {sampleRooms.map((room) => (
            <Card key={room.id} className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-600 text-white text-xs">
                        {getInitials(room.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h5 className="font-medium text-sm">{room.name}</h5>
                      <p className="text-xs text-gray-500">{room.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleJoinRoom(room.id)}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sample rooms for demonstration
const sampleRooms = [
  {
    id: 'sample-1',
    name: 'General Discussion',
    description: 'Company-wide announcements and general chat',
    type: 'public',
    members: 45
  },
  {
    id: 'sample-2', 
    name: 'Engineering Team',
    description: 'Technical discussions and development updates',
    type: 'public',
    members: 12
  },
  {
    id: 'sample-3',
    name: 'Sales & Marketing',
    description: 'Sales strategies and marketing campaigns',
    type: 'public', 
    members: 8
  }
];

export default RoomsInterface;