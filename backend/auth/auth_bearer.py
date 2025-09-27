from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .auth_handler import auth_handler

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme")
            user_data = self.verify_jwt(credentials.credentials)
            if not user_data:
                raise HTTPException(status_code=403, detail="Invalid or expired token")
            return user_data['sub']  # Return user_id
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code")

    def verify_jwt(self, token: str) -> dict:
        """Verify JWT token and return payload"""
        try:
            payload = auth_handler.decode_token(token)
            return payload
        except:
            return None

jwt_bearer = JWTBearer()