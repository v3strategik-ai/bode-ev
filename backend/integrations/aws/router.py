from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import io
from auth.auth_bearer import jwt_bearer
from integrations.aws import service
from datetime import datetime

router = APIRouter(prefix="/files", tags=["files"])

def get_s3_service():
    """Get the S3 service instance"""
    return service.s3_service

class PresignedUrlRequest(BaseModel):
    filename: str
    method: str = "GET"
    expiration: int = 3600

class FileInfo(BaseModel):
    filename: str
    original_filename: str
    file_url: str
    file_size: int
    content_type: str
    mock_mode: bool = False

class FileAttachmentInfo(BaseModel):
    id: str
    filename: str
    original_filename: str
    file_size: int
    content_type: str
    file_url: str
    uploaded_by: str
    room_id: Optional[str] = None
    message_id: Optional[str] = None

@router.post("/upload", response_model=FileInfo)
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Form("documents"),
    room_id: Optional[str] = Form(None),
    message_id: Optional[str] = Form(None),
    user_id: str = Depends(jwt_bearer)
):
    """Upload file to cloud storage"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")
    
    s3_service = get_s3_service()
    result = await s3_service.upload_file(
        file=file,
        user_id=user_id,
        folder=folder
    )
    
    # If file is associated with a room/message, store that relationship
    if room_id or message_id:
        attachment_doc = {
            "id": result["filename"],  # Use filename as ID for simplicity
            "filename": result["filename"],
            "original_filename": result["original_filename"],
            "file_size": result["file_size"],
            "content_type": result["content_type"],
            "file_url": result["file_url"],
            "uploaded_by": user_id,
            "room_id": room_id,
            "message_id": message_id,
            "created_at": datetime.utcnow()
        }
        await s3_service.db.message_attachments.insert_one(attachment_doc)
    
    return result

@router.post("/upload-multiple")
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    folder: str = Form("documents"),
    room_id: Optional[str] = Form(None),
    user_id: str = Depends(jwt_bearer)
):
    """Upload multiple files to cloud storage"""
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed")
    
    s3_service = get_s3_service()
    results = []
    for file in files:
        try:
            if not file.filename:
                results.append({
                    "filename": "unknown",
                    "success": False,
                    "error": "No filename provided"
                })
                continue
                
            result = await s3_service.upload_file(
                file=file,
                user_id=user_id,
                folder=folder
            )
            
            # Associate with room if provided
            if room_id:
                attachment_doc = {
                    "id": result["filename"],
                    "filename": result["filename"],
                    "original_filename": result["original_filename"],
                    "file_size": result["file_size"],
                    "content_type": result["content_type"],
                    "file_url": result["file_url"],
                    "uploaded_by": user_id,
                    "room_id": room_id,
                    "created_at": datetime.utcnow()
                }
                await s3_service.db.message_attachments.insert_one(attachment_doc)
            
            results.append({**result, "success": True})
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return {"results": results}

@router.get("/download/{filename:path}")
async def download_file(
    filename: str,
    user_id: str = Depends(jwt_bearer)
):
    """Download file from cloud storage"""
    s3_service = get_s3_service()
    file_data = await s3_service.download_file(filename, user_id)
    
    # Get original filename from metadata
    original_filename = file_data["metadata"].get("original_filename", filename.split("/")[-1])
    
    return StreamingResponse(
        io.BytesIO(file_data["content"]),
        media_type=file_data["content_type"],
        headers={"Content-Disposition": f"attachment; filename={original_filename}"}
    )

@router.delete("/delete/{filename:path}")
async def delete_file(
    filename: str,
    user_id: str = Depends(jwt_bearer)
):
    """Delete file from cloud storage"""
    s3_service = get_s3_service()
    result = await s3_service.delete_file(filename, user_id)
    
    # Also remove from message attachments
    await s3_service.db.message_attachments.delete_many({
        "filename": filename,
        "uploaded_by": user_id
    })
    
    return result

@router.get("/list")
async def list_files(
    folder: Optional[str] = None,
    limit: int = Query(100, le=1000),
    user_id: str = Depends(jwt_bearer)
):
    """List user files"""
    s3_service = get_s3_service()
    files = await s3_service.list_files(user_id, folder, limit)
    return {"files": files}

@router.get("/room/{room_id}/attachments")
async def get_room_attachments(
    room_id: str,
    user_id: str = Depends(jwt_bearer)
):
    """Get all file attachments for a room"""
    s3_service = get_s3_service()
    # Verify user is in room (simplified check)
    room = await s3_service.db.rooms.find_one({"id": room_id, "members": user_id})
    if not room:
        raise HTTPException(status_code=403, detail="Access denied to room")
    
    attachments_cursor = s3_service.db.message_attachments.find({"room_id": room_id})
    attachments = []
    async for attachment in attachments_cursor:
        attachments.append({
            "id": attachment["id"],
            "filename": attachment["filename"],
            "original_filename": attachment["original_filename"],
            "file_size": attachment["file_size"],
            "content_type": attachment["content_type"],
            "file_url": attachment["file_url"],
            "uploaded_by": attachment["uploaded_by"],
            "created_at": attachment["created_at"]
        })
    
    return {"attachments": attachments}

@router.post("/presigned-url")
async def generate_presigned_url(
    request: PresignedUrlRequest,
    user_id: str = Depends(jwt_bearer)
):
    """Generate presigned URL for secure file access"""
    # Add user prefix to filename for security
    if not request.filename.startswith(f"users/{user_id}/"):
        request.filename = f"users/{user_id}/{request.filename}"
    
    s3_service = get_s3_service()
    url = s3_service.generate_presigned_url(
        filename=request.filename,
        expiration=request.expiration,
        method=request.method
    )
    
    return {"presigned_url": url, "expires_in": request.expiration}

@router.get("/info/{filename:path}")
async def get_file_info(
    filename: str,
    user_id: str = Depends(jwt_bearer)
):
    """Get file information without downloading"""
    try:
        # Check if user has access to file
        if not f"users/{user_id}/" in filename and not filename.startswith("public/"):
            raise HTTPException(status_code=403, detail="Access denied")
        
        s3_service = get_s3_service()
        # First try to get from database
        file_doc = await s3_service.db.file_attachments.find_one({"filename": filename})
        if file_doc:
            return {
                "filename": filename,
                "original_filename": file_doc["original_filename"],
                "size": file_doc["file_size"],
                "content_type": file_doc["content_type"],
                "url": file_doc["file_url"],
                "uploaded_by": file_doc["uploaded_by"],
                "upload_timestamp": file_doc["upload_timestamp"],
                "mock_mode": file_doc.get("mock_mode", False)
            }
        
        # If not in database and not in mock mode, try S3
        if not s3_service.mock_mode:
            response = s3_service.s3_client.head_object(
                Bucket=s3_service.bucket_name,
                Key=filename
            )
            
            return {
                "filename": filename,
                "size": response['ContentLength'],
                "content_type": response['ContentType'],
                "last_modified": response['LastModified'].isoformat(),
                "metadata": response.get('Metadata', {}),
                "url": f"https://{s3_service.bucket_name}.s3.{s3_service.region}.amazonaws.com/{filename}",
                "mock_mode": False
            }
        
        raise HTTPException(status_code=404, detail="File not found")
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")