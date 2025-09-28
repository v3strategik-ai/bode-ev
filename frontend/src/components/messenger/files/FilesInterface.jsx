import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Share, 
  Folder,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Link,
  RefreshCw
} from 'lucide-react';
import { fileService } from '../../../services/fileService';
import { useAuth } from '../../../contexts/messenger/AuthContext';

const FilesInterface = ({ selectedRoom }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const fileInputRef = useRef(null);

  const folders = [
    { value: 'all', label: 'All Files' },
    { value: 'documents', label: 'Documents' },
    { value: 'images', label: 'Images' },
    { value: 'videos', label: 'Videos' },
    { value: 'shared', label: 'Shared' }
  ];

  useEffect(() => {
    loadFiles();
  }, [selectedFolder]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const folderParam = selectedFolder === 'all' ? null : selectedFolder;
      const response = await fileService.listFiles(folderParam);
      setFiles(response.files || []);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const folder = selectedFolder || 'documents';
        
        await fileService.uploadFile(file, folder, selectedRoom?.id);
        
        // Update progress
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // Refresh file list
      await loadFiles();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async (filename) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await fileService.deleteFile(filename);
      setFiles(prev => prev.filter(f => f.filename !== filename));
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleDownloadFile = (file) => {
    // Create download link
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.original_filename || file.filename.split('/').pop();
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateShareLink = async (file) => {
    try {
      setSelectedFile(file);
      const response = await fileService.generateShareLink(file.filename, 'GET', 3600);
      setShareLink(response.presigned_url);
      setShareModalOpen(true);
    } catch (error) {
      console.error('Failed to generate share link:', error);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = !searchQuery || 
      file.original_filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.filename.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const getFileIcon = (file) => {
    const icon = fileService.getFileIcon(file.content_type || 'application/octet-stream');
    return <span className="text-2xl mr-3">{icon}</span>;
  };

  const formatFileSize = (size) => {
    return fileService.formatFileSize(size);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Upload and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">File Management</h3>
          <p className="text-gray-600">Upload, share, and manage team files</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
          <Button variant="outline" onClick={loadFiles}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Uploading files...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Folder className="h-4 w-4 text-gray-500" />
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All folders" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map(folder => (
                    <SelectItem key={folder.value} value={folder.value}>
                      {folder.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-medium">{filteredFiles.length}</span> files
                <span className="text-gray-500 ml-2">
                  ({formatFileSize(filteredFiles.reduce((sum, f) => sum + (f.size || 0), 0))})
                </span>
              </div>
              {selectedRoom && (
                <Badge variant="outline">
                  Room: {selectedRoom.name}
                </Badge>
              )}
            </div>
            <Badge className="bg-green-50 text-green-700">
              AWS S3 Connected
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Files</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading files...</p>
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center p-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h4 className="font-semibold mb-2">No files found</h4>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'No files match your search' : 'Upload your first file to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredFiles.map((file, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      {getFileIcon(file)}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium truncate">
                          {file.original_filename || file.filename.split('/').pop()}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatFileSize(file.size || 0)}</span>
                          <span>{formatDate(file.last_modified || file.upload_timestamp)}</span>
                          {file.mock_mode && (
                            <Badge variant="secondary" className="text-xs">Mock</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadFile(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGenerateShareLink(file)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteFile(file.filename)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept="*/*"
      />

      {/* Share Link Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedFile && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                {getFileIcon(selectedFile)}
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium truncate">
                    {selectedFile.original_filename || selectedFile.filename.split('/').pop()}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size || 0)}
                  </p>
                </div>
              </div>
            )}
            
            {shareLink && (
              <div>
                <label className="text-sm font-medium">Secure Share Link (1 hour expiry)</label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input value={shareLink} readOnly />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(shareLink)}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This link will expire in 1 hour for security
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilesInterface;