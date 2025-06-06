
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Play, Download, Share, Eye, Clock, Calendar, Tag } from 'lucide-react';

interface VideoLecture {
  id: string;
  title: string;
  description?: string;
  level: string;
  subject: string;
  chapter: string;
  duration: string;
  views: number;
  status: 'published' | 'draft' | 'processing';
  uploadDate: string;
  tags?: string[];
  thumbnail?: string;
}

interface VideoDetailsViewProps {
  video: VideoLecture;
  onBack: () => void;
  onEdit: (video: VideoLecture) => void;
  onDelete: (id: string) => void;
}

export const VideoDetailsView: React.FC<VideoDetailsViewProps> = ({ video, onBack, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDelete = () => {
    onDelete(video.id);
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="border-slate-600 text-slate-300 hover:text-white">
          <ArrowLeft size={16} className="mr-2" />
          Back to Videos
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
            <Share size={16} className="mr-2" />
            Share
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
            <Download size={16} className="mr-2" />
            Download
          </Button>
          <Button onClick={() => onEdit(video)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowDeleteConfirm(true)}
            className="border-red-600 text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-slate-900 rounded-t-lg flex items-center justify-center">
                <div className="text-center">
                  <Play size={64} className="text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">{video.title}</p>
                  <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Play size={16} className="mr-2" />
                    Play Video
                  </Button>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusColor(video.status)} text-white`}>
                    {video.status}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-sm flex items-center">
                  <Clock size={12} className="mr-1" />
                  {video.duration}
                </div>
              </div>
              
              <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-4">{video.title}</h1>
                {video.description && (
                  <p className="text-slate-300 mb-4">{video.description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    {video.views} views
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {video.uploadDate}
                  </div>
                </div>

                {video.tags && video.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <Tag size={16} className="text-slate-400 mr-1" />
                      <span className="text-slate-400 text-sm">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Information */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Video Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 text-sm">Level:</span>
                  <p className="text-white">{video.level}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Subject:</span>
                  <p className="text-white">{video.subject}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Chapter:</span>
                  <p className="text-white">{video.chapter}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Duration:</span>
                  <p className="text-white">{video.duration}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Status:</span>
                  <Badge className={`${getStatusColor(video.status)} text-white mt-1`}>
                    {video.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Analytics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Views:</span>
                  <span className="text-white font-medium">{video.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Upload Date:</span>
                  <span className="text-white">{video.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Watch Time:</span>
                  <span className="text-white">Coming soon</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Completion Rate:</span>
                  <span className="text-white">Coming soon</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Delete Video</h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete "{video.title}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
