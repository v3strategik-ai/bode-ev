from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid

# User Management Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    username: str
    full_name: str
    avatar_url: Optional[str] = None
    status: str = "offline"  # online, offline, away, busy
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_seen: Optional[datetime] = None
    
class UserCreate(BaseModel):
    email: str
    username: str
    full_name: str
    password: str
    avatar_url: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

# Chat Room Models
class ChatRoom(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    type: str = "public"  # public, private, direct
    created_by: str  # user_id
    members: List[str] = []  # user_ids
    admins: List[str] = []  # user_ids
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class ChatRoomCreate(BaseModel):
    name: str
    description: Optional[str] = None
    type: str = "public"
    members: List[str] = []

# Message Models
class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    room_id: str
    sender_id: str
    content: str
    message_type: str = "text"  # text, image, file, video_call, audio_call
    reply_to: Optional[str] = None  # message_id for replies
    attachments: List[Dict[str, Any]] = []
    reactions: Dict[str, List[str]] = {}  # emoji -> [user_ids]
    edited: bool = False
    edited_at: Optional[datetime] = None
    delivered_to: List[str] = []  # user_ids who received the message
    read_by: List[str] = []  # user_ids who read the message
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
class MessageCreate(BaseModel):
    room_id: str
    content: str
    message_type: str = "text"
    reply_to: Optional[str] = None
    attachments: List[Dict[str, Any]] = []

class MessageUpdate(BaseModel):
    content: str

# File Attachment Models
class FileAttachment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    original_filename: str
    file_size: int
    content_type: str
    s3_url: str
    uploaded_by: str  # user_id
    room_id: Optional[str] = None
    message_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Video Call Models
class VideoCall(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    room_id: str
    initiator_id: str  # user_id who started the call
    participants: List[str] = []  # user_ids
    call_type: str = "video"  # video, audio, screen_share
    status: str = "waiting"  # waiting, active, ended
    zoom_meeting_id: Optional[str] = None  # if using Zoom integration
    webrtc_room_id: Optional[str] = None  # if using WebRTC
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VideoCallCreate(BaseModel):
    room_id: str
    call_type: str = "video"
    use_external: bool = False  # True for Zoom, False for WebRTC

# Integration Models
class Integration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    integration_type: str  # slack, zoom, salesforce, hubspot
    credentials: Dict[str, Any] = {}  # encrypted credentials
    config: Dict[str, Any] = {}
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class IntegrationCreate(BaseModel):
    integration_type: str
    config: Dict[str, Any] = {}

# Notification Models
class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # message, call, mention, integration
    title: str
    content: str
    data: Dict[str, Any] = {}  # additional context data
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))