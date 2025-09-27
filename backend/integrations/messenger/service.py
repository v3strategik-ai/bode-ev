from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from typing import List, Dict, Optional
from datetime import datetime, timezone
import json
import logging
from ...models.messenger import User, ChatRoom, Message, VideoCall, FileAttachment
from ...auth.auth_handler import auth_handler

logger = logging.getLogger(__name__)

class MessengerService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.active_connections: Dict[str, List] = {}  # user_id -> [websocket connections]
    
    # User Management
    async def create_user(self, user_data: dict) -> User:
        """Create a new user account"""
        try:
            # Check if user already exists
            existing_user = await self.db.users.find_one({"email": user_data["email"]})
            if existing_user:
                raise HTTPException(status_code=400, detail="User already exists")
            
            # Hash password
            user_data["password"] = auth_handler.hash_password(user_data["password"])
            
            # Create user
            user = User(**user_data)
            await self.db.users.insert_one(user.dict())
            
            return user
        except Exception as e:
            logger.error(f"User creation error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"User creation failed: {str(e)}")
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user login"""
        try:
            user_doc = await self.db.users.find_one({"email": email})
            if not user_doc:
                return None
            
            user = User(**user_doc)
            if not auth_handler.verify_password(password, user_doc["password"]):
                return None
            
            # Update last seen
            await self.db.users.update_one(
                {"_id": user_doc["_id"]},
                {"$set": {"last_seen": datetime.now(timezone.utc), "status": "online"}}
            )
            
            return user
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return None
    
    async def get_user(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        try:
            user_doc = await self.db.users.find_one({"id": user_id})
            if user_doc:
                return User(**user_doc)
            return None
        except Exception as e:
            logger.error(f"Get user error: {str(e)}")
            return None
    
    async def update_user_status(self, user_id: str, status: str) -> bool:
        """Update user online status"""
        try:
            result = await self.db.users.update_one(
                {"id": user_id},
                {"$set": {"status": status, "last_seen": datetime.now(timezone.utc)}}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Update user status error: {str(e)}")
            return False
    
    # Room Management
    async def create_room(self, room_data: dict, creator_id: str) -> ChatRoom:
        """Create a new chat room"""
        try:
            room_data["created_by"] = creator_id
            room_data["admins"] = [creator_id]
            if creator_id not in room_data.get("members", []):
                room_data["members"] = room_data.get("members", []) + [creator_id]
            
            room = ChatRoom(**room_data)
            await self.db.rooms.insert_one(room.dict())
            
            return room
        except Exception as e:
            logger.error(f"Room creation error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Room creation failed: {str(e)}")
    
    async def get_user_rooms(self, user_id: str) -> List[ChatRoom]:
        """Get all rooms for a user"""
        try:
            rooms_cursor = self.db.rooms.find({"members": user_id, "is_active": True})
            rooms = []
            async for room_doc in rooms_cursor:
                rooms.append(ChatRoom(**room_doc))
            return rooms
        except Exception as e:
            logger.error(f"Get user rooms error: {str(e)}")
            return []
    
    async def join_room(self, room_id: str, user_id: str) -> bool:
        """Add user to room"""
        try:
            result = await self.db.rooms.update_one(
                {"id": room_id, "type": "public"},
                {"$addToSet": {"members": user_id}}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Join room error: {str(e)}")
            return False
    
    async def leave_room(self, room_id: str, user_id: str) -> bool:
        """Remove user from room"""
        try:
            result = await self.db.rooms.update_one(
                {"id": room_id},
                {"$pull": {"members": user_id, "admins": user_id}}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Leave room error: {str(e)}")
            return False
    
    # Message Management
    async def send_message(self, message_data: dict, sender_id: str) -> Message:
        """Send a message to a room"""
        try:
            message_data["sender_id"] = sender_id
            message = Message(**message_data)
            
            # Verify user is in room
            room = await self.db.rooms.find_one({"id": message.room_id, "members": sender_id})
            if not room:
                raise HTTPException(status_code=403, detail="User not in room")
            
            await self.db.messages.insert_one(message.dict())
            
            # Notify room members (implement WebSocket broadcasting later)
            await self.broadcast_to_room(message.room_id, {
                "type": "new_message",
                "message": message.dict()
            }, exclude_user=sender_id)
            
            return message
        except Exception as e:
            logger.error(f"Send message error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Send message failed: {str(e)}")
    
    async def get_room_messages(self, room_id: str, user_id: str, limit: int = 50) -> List[Message]:
        """Get messages from a room"""
        try:
            # Verify user is in room
            room = await self.db.rooms.find_one({"id": room_id, "members": user_id})
            if not room:
                raise HTTPException(status_code=403, detail="User not in room")
            
            messages_cursor = self.db.messages.find({"room_id": room_id}).sort("created_at", -1).limit(limit)
            messages = []
            async for msg_doc in messages_cursor:
                messages.append(Message(**msg_doc))
            
            return list(reversed(messages))  # Return in chronological order
        except Exception as e:
            logger.error(f"Get messages error: {str(e)}")
            return []
    
    async def update_message(self, message_id: str, content: str, user_id: str) -> bool:
        """Update message content"""
        try:
            result = await self.db.messages.update_one(
                {"id": message_id, "sender_id": user_id},
                {
                    "$set": {
                        "content": content,
                        "edited": True,
                        "edited_at": datetime.now(timezone.utc)
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Update message error: {str(e)}")
            return False
    
    async def delete_message(self, message_id: str, user_id: str) -> bool:
        """Delete a message"""
        try:
            # Check if user owns message or is room admin
            message = await self.db.messages.find_one({"id": message_id})
            if not message:
                return False
            
            if message["sender_id"] != user_id:
                # Check if user is room admin
                room = await self.db.rooms.find_one({"id": message["room_id"], "admins": user_id})
                if not room:
                    raise HTTPException(status_code=403, detail="Not authorized to delete message")
            
            result = await self.db.messages.delete_one({"id": message_id})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Delete message error: {str(e)}")
            return False
    
    # Video Call Management
    async def start_video_call(self, call_data: dict, initiator_id: str) -> VideoCall:
        """Start a video call"""
        try:
            call_data["initiator_id"] = initiator_id
            call_data["participants"] = [initiator_id]
            call_data["started_at"] = datetime.now(timezone.utc)
            call_data["status"] = "active"
            
            call = VideoCall(**call_data)
            await self.db.video_calls.insert_one(call.dict())
            
            # Notify room members about the call
            await self.broadcast_to_room(call.room_id, {
                "type": "video_call_started",
                "call": call.dict()
            })
            
            return call
        except Exception as e:
            logger.error(f"Start video call error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Start video call failed: {str(e)}")
    
    async def join_video_call(self, call_id: str, user_id: str) -> bool:
        """Join a video call"""
        try:
            result = await self.db.video_calls.update_one(
                {"id": call_id, "status": "active"},
                {"$addToSet": {"participants": user_id}}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Join video call error: {str(e)}")
            return False
    
    async def end_video_call(self, call_id: str, user_id: str) -> bool:
        """End a video call"""
        try:
            call = await self.db.video_calls.find_one({"id": call_id})
            if not call or call["initiator_id"] != user_id:
                raise HTTPException(status_code=403, detail="Not authorized to end call")
            
            result = await self.db.video_calls.update_one(
                {"id": call_id},
                {
                    "$set": {
                        "status": "ended",
                        "ended_at": datetime.now(timezone.utc)
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"End video call error: {str(e)}")
            return False
    
    # WebSocket Connection Management
    def add_connection(self, user_id: str, websocket):
        """Add WebSocket connection for user"""
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
    
    def remove_connection(self, user_id: str, websocket):
        """Remove WebSocket connection for user"""
        if user_id in self.active_connections:
            try:
                self.active_connections[user_id].remove(websocket)
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
            except ValueError:
                pass
    
    async def broadcast_to_room(self, room_id: str, message: dict, exclude_user: str = None):
        """Broadcast message to all users in room"""
        try:
            # Get room members
            room = await self.db.rooms.find_one({"id": room_id})
            if not room:
                return
            
            # Send to all connected members
            for member_id in room["members"]:
                if member_id != exclude_user and member_id in self.active_connections:
                    for websocket in self.active_connections[member_id]:
                        try:
                            await websocket.send_text(json.dumps(message))
                        except Exception as e:
                            logger.error(f"WebSocket send error: {e}")
                            # Remove bad connection
                            self.remove_connection(member_id, websocket)
        except Exception as e:
            logger.error(f"Broadcast error: {str(e)}")

messenger_service = None  # Will be initialized with database connection