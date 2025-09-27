from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, BackgroundTasks
from fastapi.security import HTTPBearer
from typing import List, Dict, Optional
import json
import logging
from datetime import datetime
from ...auth.auth_bearer import jwt_bearer, auth_handler
from ...models.messenger import (
    UserCreate, UserLogin, ChatRoomCreate, MessageCreate, MessageUpdate, 
    VideoCallCreate, User, ChatRoom, Message, VideoCall
)
from .service import messenger_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/messenger", tags=["messenger"])

# Authentication endpoints
@router.post("/register", response_model=User)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    return await messenger_service.create_user(user_data.dict())

@router.post("/login")
async def login_user(login_data: UserLogin):
    """Login user and return JWT token"""
    user = await messenger_service.authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = auth_handler.encode_token(user.id, user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/profile", response_model=User)
async def get_profile(user_id: str = Depends(jwt_bearer)):
    """Get current user profile"""
    user = await messenger_service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/status")
async def update_status(status: str, user_id: str = Depends(jwt_bearer)):
    """Update user online status"""
    success = await messenger_service.update_user_status(user_id, status)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update status")
    return {"message": "Status updated successfully"}

# Room management endpoints
@router.post("/rooms", response_model=ChatRoom)
async def create_room(room_data: ChatRoomCreate, user_id: str = Depends(jwt_bearer)):
    """Create a new chat room"""
    return await messenger_service.create_room(room_data.dict(), user_id)

@router.get("/rooms", response_model=List[ChatRoom])
async def get_user_rooms(user_id: str = Depends(jwt_bearer)):
    """Get all rooms for current user"""
    return await messenger_service.get_user_rooms(user_id)

@router.post("/rooms/{room_id}/join")
async def join_room(room_id: str, user_id: str = Depends(jwt_bearer)):
    """Join a chat room"""
    success = await messenger_service.join_room(room_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to join room")
    return {"message": "Joined room successfully"}

@router.post("/rooms/{room_id}/leave")
async def leave_room(room_id: str, user_id: str = Depends(jwt_bearer)):
    """Leave a chat room"""
    success = await messenger_service.leave_room(room_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to leave room")
    return {"message": "Left room successfully"}

# Message endpoints
@router.post("/messages", response_model=Message)
async def send_message(message_data: MessageCreate, user_id: str = Depends(jwt_bearer)):
    """Send a message to a room"""
    return await messenger_service.send_message(message_data.dict(), user_id)

@router.get("/rooms/{room_id}/messages", response_model=List[Message])
async def get_messages(
    room_id: str, 
    limit: int = 50, 
    user_id: str = Depends(jwt_bearer)
):
    """Get messages from a room"""
    return await messenger_service.get_room_messages(room_id, user_id, limit)

@router.put("/messages/{message_id}")
async def update_message(
    message_id: str, 
    update_data: MessageUpdate, 
    user_id: str = Depends(jwt_bearer)
):
    """Update a message"""
    success = await messenger_service.update_message(message_id, update_data.content, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update message")
    return {"message": "Message updated successfully"}

@router.delete("/messages/{message_id}")
async def delete_message(message_id: str, user_id: str = Depends(jwt_bearer)):
    """Delete a message"""
    success = await messenger_service.delete_message(message_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete message")
    return {"message": "Message deleted successfully"}

# Video call endpoints
@router.post("/calls", response_model=VideoCall)
async def start_call(call_data: VideoCallCreate, user_id: str = Depends(jwt_bearer)):
    """Start a video call"""
    return await messenger_service.start_video_call(call_data.dict(), user_id)

@router.post("/calls/{call_id}/join")
async def join_call(call_id: str, user_id: str = Depends(jwt_bearer)):
    """Join a video call"""
    success = await messenger_service.join_video_call(call_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to join call")
    return {"message": "Joined call successfully"}

@router.post("/calls/{call_id}/end")
async def end_call(call_id: str, user_id: str = Depends(jwt_bearer)):
    """End a video call"""
    success = await messenger_service.end_video_call(call_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to end call")
    return {"message": "Call ended successfully"}

# WebSocket endpoint for real-time messaging
@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time messaging"""
    await websocket.accept()
    messenger_service.add_connection(user_id, websocket)
    
    # Update user status to online
    await messenger_service.update_user_status(user_id, "online")
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            message_type = message_data.get("type")
            
            if message_type == "ping":
                # Heartbeat
                await websocket.send_text(json.dumps({"type": "pong"}))
            
            elif message_type == "typing":
                # Broadcast typing indicator
                room_id = message_data.get("room_id")
                if room_id:
                    await messenger_service.broadcast_to_room(room_id, {
                        "type": "typing",
                        "user_id": user_id,
                        "room_id": room_id
                    }, exclude_user=user_id)
            
            elif message_type == "stop_typing":
                # Stop typing indicator
                room_id = message_data.get("room_id")
                if room_id:
                    await messenger_service.broadcast_to_room(room_id, {
                        "type": "stop_typing",
                        "user_id": user_id,
                        "room_id": room_id
                    }, exclude_user=user_id)
    
    except WebSocketDisconnect:
        messenger_service.remove_connection(user_id, websocket)
        # Update user status to offline
        await messenger_service.update_user_status(user_id, "offline")
        logger.info(f"User {user_id} disconnected from WebSocket")
    except Exception as e:
        logger.error(f"WebSocket error for user {user_id}: {e}")
        messenger_service.remove_connection(user_id, websocket)
        await messenger_service.update_user_status(user_id, "offline")