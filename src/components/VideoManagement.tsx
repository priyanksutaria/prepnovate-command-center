
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Video, Play, Clock, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { VideoUploadForm } from './VideoUploadForm';
import { VideoDetailsView } from './VideoDetailsView';
import { VideoEditDialog } from './VideoEditDialog';

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

const mockVideos: VideoLecture[] = [
  { 
    id: '1', 
    title: 'Introduction to Financial Statement Analysis', 
    description: 'Comprehensive overview of financial statement analysis fundamentals for CFA Level I candidates.',
    level: 'Level I', 
    subject: 'Financial Analysis', 
    chapter: 'Chapter 1', 
    duration: '45:32', 
    views: 1250, 
    status: 'published', 
    uploadDate: '2024-01-15',
    tags: ['Financial Statements', 'Basics', 'Analysis']
  },
  { 
    id: '2', 
    title: 'Time Value of Money Concepts', 
    description: 'Deep dive into present value, future value, and annuity calculations.',
    level: 'Level I', 
    subject: 'Quantitative', 
    chapter: 'Chapter 2', 
    duration: '38:15', 
    views: 987, 
    status: 'published', 
    uploadDate: '2024-01-14',
    tags: ['Time Value', 'PV', 'FV', 'Annuities']
  },
  { 
    id: '3', 
    title: 'Ethics in Investment Management', 
    description: 'Professional standards and ethical guidelines for investment professionals.',
    level: 'Level I', 
    subject: 'Ethics', 
    chapter: 'Chapter 1', 
    duration: '52:41', 
    views: 756, 
    status: 'processing', 
    uploadDate: '2024-01-13',
    tags: ['Ethics', 'Standards', 'Professional Conduct']
  },
  { 
    id: '4', 
    title: 'Advanced Portfolio Theory', 
    description: 'Modern portfolio theory and asset allocation strategies.',
    level: 'Level III', 
    subject: 'Portfolio', 
    chapter: 'Chapter 5', 
    duration: '61:28', 
    views: 423, 
    status: 'draft', 
    uploadDate: '2024-01-12',
    tags: ['Portfolio Theory', 'MPT', 'Asset Allocation']
  },
];

export const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<VideoLecture[]>(mockVideos);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoLecture | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoLecture | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (video.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === 'all' || video.level === levelFilter;
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || video.subject === subjectFilter;
    
    return matchesSearch && matchesLevel && matchesStatus && matchesSubject;
  });

  const handleAddVideo = (newVideo: VideoLecture) => {
    setVideos(prev => [newVideo, ...prev]);
  };

  const handleEditVideo = (updatedVideo: VideoLecture) => {
    setVideos(prev => prev.map(video => 
      video.id === updatedVideo.id ? updatedVideo : video
    ));
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  const subjects = Array.from(new Set(videos.map(video => video.subject)));
  const levels = ['Level I', 'Level II', 'Level III'];

  if (selectedVideo) {
    return (
      <VideoDetailsView
        video={selectedVideo}
        onBack={() => setSelectedVideo(null)}
        onEdit={(video) => {
          setEditingVideo(video);
          setSelectedVideo(null);
        }}
        onDelete={handleDeleteVideo}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Video Lecture Management</h1>
          <p className="text-slate-400">Upload and manage video content</p>
        </div>
        <Button 
          onClick={() => setShowUploadForm(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <Plus size={20} className="mr-2" />
          Upload Video
        </Button>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search videos, subjects, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-slate-400" />
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all" className="text-white">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level} className="text-white">{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all" className="text-white">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject} className="text-white">{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="published" className="text-white">Published</SelectItem>
                <SelectItem value="draft" className="text-white">Draft</SelectItem>
                <SelectItem value="processing" className="text-white">Processing</SelectItem>
              </SelectContent>
            </Select>

            {(levelFilter !== 'all' || subjectFilter !== 'all' || statusFilter !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLevelFilter('all');
                  setSubjectFilter('all');
                  setStatusFilter('all');
                }}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden hover:border-cyan-500 transition-colors cursor-pointer">
              <div 
                className="relative h-48 bg-slate-600 flex items-center justify-center"
                onClick={() => setSelectedVideo(video)}
              >
                <Video className="text-slate-400" size={48} />
                <div className="absolute top-2 right-2">
                  <Badge className={`${getStatusColor(video.status)} text-white text-xs`}>
                    {video.status}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-xs flex items-center">
                  <Clock size={12} className="mr-1" />
                  {video.duration}
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-xs flex items-center">
                  <Eye size={12} className="mr-1" />
                  {video.views}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-cyan-400" onClick={() => setSelectedVideo(video)}>
                  {video.title}
                </h3>
                <p className="text-slate-300 text-sm mb-1">{video.level} • {video.subject}</p>
                <p className="text-slate-400 text-sm mb-3">{video.chapter}</p>
                
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-slate-500 text-slate-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {video.tags.length > 2 && (
                      <Badge variant="outline" className="border-slate-500 text-slate-400 text-xs">
                        +{video.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>{video.uploadDate}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-slate-500 text-slate-300 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVideo(video);
                    }}
                  >
                    <Play size={14} className="mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-slate-500 text-slate-300 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingVideo(video);
                    }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-slate-500 text-red-400 hover:text-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVideo(video.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <Video className="mx-auto h-16 w-16 text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No videos found</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm || levelFilter !== 'all' || statusFilter !== 'all' || subjectFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by uploading your first video lecture'
              }
            </p>
            {!searchTerm && levelFilter === 'all' && statusFilter === 'all' && subjectFilter === 'all' && (
              <Button 
                onClick={() => setShowUploadForm(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus size={16} className="mr-2" />
                Upload First Video
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <VideoUploadForm
          onClose={() => setShowUploadForm(false)}
          onSave={handleAddVideo}
        />
      )}

      {/* Edit Dialog */}
      <VideoEditDialog
        isOpen={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        video={editingVideo}
        onSave={handleEditVideo}
      />
    </div>
  );
};
