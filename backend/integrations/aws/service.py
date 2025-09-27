import boto3
import os
import uuid
import mimetypes
from datetime import datetime, timedelta
from fastapi import HTTPException, UploadFile
from botocore.exceptions import ClientError, NoCredentialsError
from typing import Dict, List, Optional, BinaryIO
import logging
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

class S3Service:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.bucket_name = os.getenv("AWS_S3_BUCKET")
        
        # For now, we'll work in mock mode if no keys are provided
        self.mock_mode = not all([self.aws_access_key, self.aws_secret_key, self.bucket_name])
        
        if self.mock_mode:
            logger.info("S3Service running in MOCK mode - AWS credentials not configured")
            self.s3_client = None
        else:
            try:
                self.s3_client = boto3.client(
                    's3',
                    aws_access_key_id=self.aws_access_key,
                    aws_secret_access_key=self.aws_secret_key,
                    region_name=self.region
                )
                
                # Verify bucket access
                self.s3_client.head_bucket(Bucket=self.bucket_name)
                logger.info(f"S3Service connected to bucket: {self.bucket_name}")
            except NoCredentialsError:
                logger.warning("AWS credentials not found, falling back to mock mode")
                self.mock_mode = True
                self.s3_client = None
            except ClientError as e:
                error_code = e.response['Error']['Code']
                if error_code == '404':
                    logger.warning(f"S3 bucket '{self.bucket_name}' not found, falling back to mock mode")
                else:
                    logger.warning(f"S3 connection error: {error_code}, falling back to mock mode")
                self.mock_mode = True
                self.s3_client = None
    
    def _generate_unique_filename(self, original_filename: str, user_id: str) -> str:
        """Generate unique filename with user prefix"""
        file_extension = os.path.splitext(original_filename)[1]
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        return f"users/{user_id}/{timestamp}_{unique_id}{file_extension}"
    
    def _validate_file(self, file: UploadFile) -> None:
        """Validate uploaded file"""
        # Check file size (max 50MB)
        max_size = 50 * 1024 * 1024  # 50MB
        if hasattr(file, 'size') and file.size and file.size > max_size:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 50MB")
        
        # Check allowed file types
        allowed_types = {
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'text/plain', 'text/csv',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'video/mp4', 'video/mpeg', 'video/quicktime',
            'audio/mpeg', 'audio/wav', 'audio/ogg',
            'application/octet-stream'  # Allow for files without explicit mime type
        }
        
        if file.content_type and file.content_type not in allowed_types:
            raise HTTPException(status_code=415, detail=f"File type '{file.content_type}' not allowed")
    
    async def upload_file(
        self,
        file: UploadFile,
        user_id: str,
        folder: str = "documents",
        custom_filename: str = None
    ) -> Dict:
        """Upload file to S3 bucket or mock storage"""
        try:
            # Validate file
            self._validate_file(file)
            
            # Generate filename
            if custom_filename:
                filename = f"{folder}/{user_id}/{custom_filename}"
            else:
                filename = f"{folder}/{self._generate_unique_filename(file.filename, user_id)}"
            
            # Read file content
            file_content = await file.read()
            
            if self.mock_mode:
                # Mock mode - simulate file storage
                file_url = f"https://mock-s3-bucket.s3.{self.region}.amazonaws.com/{filename}"
                
                # Store file metadata in database for mock mode
                file_doc = {
                    "id": str(uuid.uuid4()),
                    "filename": filename,
                    "original_filename": file.filename,
                    "file_size": len(file_content),
                    "content_type": file.content_type or 'application/octet-stream',
                    "file_url": file_url,
                    "uploaded_by": user_id,
                    "upload_timestamp": datetime.utcnow(),
                    "mock_content": file_content[:1024].hex() if len(file_content) > 1024 else file_content.hex(),  # Store first 1KB for testing
                    "mock_mode": True
                }
                
                await self.db.file_attachments.insert_one(file_doc)
                
                return {
                    "success": True,
                    "filename": filename,
                    "original_filename": file.filename,
                    "file_url": file_url,
                    "file_size": len(file_content),
                    "content_type": file.content_type,
                    "mock_mode": True
                }
            else:
                # Real S3 upload
                self.s3_client.put_object(
                    Bucket=self.bucket_name,
                    Key=filename,
                    Body=file_content,
                    ContentType=file.content_type or 'application/octet-stream',
                    Metadata={
                        'original_filename': file.filename,
                        'uploaded_by': user_id,
                        'upload_timestamp': datetime.utcnow().isoformat()
                    }
                )
                
                # Generate file URL
                file_url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{filename}"
                
                # Store file metadata in database
                file_doc = {
                    "id": str(uuid.uuid4()),
                    "filename": filename,
                    "original_filename": file.filename,
                    "file_size": len(file_content),
                    "content_type": file.content_type or 'application/octet-stream',
                    "file_url": file_url,
                    "uploaded_by": user_id,
                    "upload_timestamp": datetime.utcnow(),
                    "mock_mode": False
                }
                
                await self.db.file_attachments.insert_one(file_doc)
                
                return {
                    "success": True,
                    "filename": filename,
                    "original_filename": file.filename,
                    "file_url": file_url,
                    "file_size": len(file_content),
                    "content_type": file.content_type,
                    "mock_mode": False
                }
                
        except ClientError as e:
            logger.error(f"S3 upload error: {e}")
            raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
        except Exception as e:
            logger.error(f"Upload error: {e}")
            raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
    
    async def download_file(self, filename: str, user_id: str) -> Dict:
        """Download file from S3 bucket or mock storage"""
        try:
            # Check if user has access to file (simple check - implement proper authorization)
            if not f"users/{user_id}/" in filename and not filename.startswith("public/"):
                raise HTTPException(status_code=403, detail="Access denied")
            
            if self.mock_mode:
                # Get file from database in mock mode
                file_doc = await self.db.file_attachments.find_one({"filename": filename, "uploaded_by": user_id})
                if not file_doc:
                    raise HTTPException(status_code=404, detail="File not found")
                
                # Simulate file content (in real implementation, you'd store actual content)
                mock_content = f"Mock file content for {file_doc['original_filename']}"
                
                return {
                    "content": mock_content.encode(),
                    "content_type": file_doc.get('content_type', 'application/octet-stream'),
                    "metadata": {
                        "original_filename": file_doc['original_filename'],
                        "uploaded_by": file_doc['uploaded_by'],
                        "upload_timestamp": str(file_doc['upload_timestamp'])
                    },
                    "mock_mode": True
                }
            else:
                response = self.s3_client.get_object(Bucket=self.bucket_name, Key=filename)
                
                return {
                    "content": response['Body'].read(),
                    "content_type": response.get('ContentType', 'application/octet-stream'),
                    "metadata": response.get('Metadata', {}),
                    "mock_mode": False
                }
                
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'NoSuchKey':
                raise HTTPException(status_code=404, detail="File not found")
            else:
                raise HTTPException(status_code=500, detail=f"Download failed: {error_code}")
    
    async def delete_file(self, filename: str, user_id: str) -> Dict:
        """Delete file from S3 bucket or mock storage"""
        try:
            # Check if user has access to file
            if not f"users/{user_id}/" in filename:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if self.mock_mode:
                # Delete from database in mock mode
                result = await self.db.file_attachments.delete_one({
                    "filename": filename, 
                    "uploaded_by": user_id
                })
                
                if result.deleted_count == 0:
                    raise HTTPException(status_code=404, detail="File not found")
                
                return {"success": True, "message": "File deleted successfully", "mock_mode": True}
            else:
                # Delete from S3
                self.s3_client.delete_object(Bucket=self.bucket_name, Key=filename)
                
                # Also remove from database
                await self.db.file_attachments.delete_one({
                    "filename": filename,
                    "uploaded_by": user_id
                })
                
                return {"success": True, "message": "File deleted successfully", "mock_mode": False}
                
        except ClientError as e:
            logger.error(f"S3 delete error: {e}")
            raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")
    
    async def list_files(self, user_id: str, folder: str = None, limit: int = 100) -> List[Dict]:
        """List files for a user"""
        try:
            if self.mock_mode:
                # Get files from database in mock mode
                query = {"uploaded_by": user_id}
                if folder:
                    query["filename"] = {"$regex": f"^{folder}/"}
                
                files_cursor = self.db.file_attachments.find(query).limit(limit)
                files = []
                async for file_doc in files_cursor:
                    files.append({
                        "filename": file_doc["filename"],
                        "original_filename": file_doc["original_filename"],
                        "size": file_doc["file_size"],
                        "last_modified": file_doc["upload_timestamp"],
                        "url": file_doc["file_url"],
                        "content_type": file_doc["content_type"],
                        "mock_mode": True
                    })
                
                return files
            else:
                # Get files from S3
                prefix = f"users/{user_id}/"
                if folder:
                    prefix += f"{folder}/"
                
                response = self.s3_client.list_objects_v2(
                    Bucket=self.bucket_name,
                    Prefix=prefix,
                    MaxKeys=limit
                )
                
                files = []
                for obj in response.get('Contents', []):
                    files.append({
                        "filename": obj['Key'],
                        "size": obj['Size'],
                        "last_modified": obj['LastModified'].isoformat(),
                        "url": f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{obj['Key']}",
                        "mock_mode": False
                    })
                
                return files
                
        except ClientError as e:
            logger.error(f"S3 list error: {e}")
            raise HTTPException(status_code=500, detail=f"List files failed: {str(e)}")
    
    def generate_presigned_url(
        self,
        filename: str,
        expiration: int = 3600,
        method: str = "GET"
    ) -> str:
        """Generate presigned URL for secure file access"""
        if self.mock_mode:
            # Return mock presigned URL
            return f"https://mock-s3-bucket.s3.{self.region}.amazonaws.com/{filename}?expires={expiration}&mock=true"
        
        try:
            if method == "GET":
                url = self.s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': self.bucket_name, 'Key': filename},
                    ExpiresIn=expiration
                )
            elif method == "PUT":
                url = self.s3_client.generate_presigned_url(
                    'put_object',
                    Params={'Bucket': self.bucket_name, 'Key': filename},
                    ExpiresIn=expiration
                )
            else:
                raise ValueError("Method must be GET or PUT")
            
            return url
            
        except ClientError as e:
            logger.error(f"Presigned URL error: {e}")
            raise HTTPException(status_code=500, detail=f"URL generation failed: {str(e)}")

# Global service instance (will be initialized in main app)
s3_service: S3Service = None