import jwt
import os
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from passlib.context import CryptContext
import uuid
import bcrypt

class AuthHandler:
    def __init__(self):
        self.secret_key = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
        self.algorithm = "HS256"
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    def encode_token(self, user_id: str, email: str = None, scopes: list = None) -> str:
        """Generate JWT token for user"""
        payload = {
            'exp': datetime.utcnow() + timedelta(hours=24),
            'iat': datetime.utcnow(),
            'sub': user_id,
            'email': email,
            'scopes': scopes or []
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def decode_token(self, token: str) -> dict:
        """Decode and validate JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt directly"""
        try:
            # Use bcrypt directly to avoid passlib issues
            password_bytes = password.encode('utf-8')
            # Ensure password is within bcrypt limit
            if len(password_bytes) > 72:
                password_bytes = password_bytes[:72]
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password_bytes, salt)
            return hashed.decode('utf-8')
        except Exception as e:
            # Fallback to passlib with truncated password
            password = password[:50]  # Conservative limit
            return self.pwd_context.hash(password)
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        try:
            # Try bcrypt directly first
            password_bytes = password.encode('utf-8')
            if len(password_bytes) > 72:
                password_bytes = password_bytes[:72]
            hashed_bytes = hashed.encode('utf-8')
            return bcrypt.checkpw(password_bytes, hashed_bytes)
        except:
            # Fallback to passlib
            return self.pwd_context.verify(password, hashed)
    
    def generate_user_id(self) -> str:
        """Generate unique user ID"""
        return str(uuid.uuid4())

auth_handler = AuthHandler()