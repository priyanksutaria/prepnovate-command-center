
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, X, Plus } from 'lucide-react';

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

interface VideoEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoLecture | null;
  onSave: (video: VideoLecture) => void;
}

export const VideoEditDialog: React.FC<VideoEditDialogProps> = ({ 
  isOpen, 
  onClose, 
  video, 
  onSave 
}) => {
  const [editedVideo, setEditedVideo] = useState<VideoLecture | null>(null);

  const levels = ['Level I', 'Level II', 'Level III'];
  const subjects = ['Financial Analysis', 'Quantitative', 'Ethics', 'Portfolio', 'Economics', 'Corporate Finance'];
  const statusOptions = ['published', 'draft', 'processing'];

  useEffect(() => {
    if (video) {
      setEditedVideo({ 
        ...video, 
        tags: video.tags || [''] 
      });
    }
  }, [video]);

  const handleInputChange = (field: string, value: string) => {
    if (editedVideo) {
      setEditedVideo({ ...editedVideo, [field]: value });
    }
  };

  const handleTagChange = (index: number, value: string) => {
    if (editedVideo) {
      const newTags = [...(editedVideo.tags || [])];
      newTags[index] = value;
      setEditedVideo({ ...editedVideo, tags: newTags });
    }
  };

  const addTag = () => {
    if (editedVideo) {
      setEditedVideo({ 
        ...editedVideo, 
        tags: [...(editedVideo.tags || []), ''] 
      });
    }
  };

  const removeTag = (index: number) => {
    if (editedVideo) {
      const newTags = (editedVideo.tags || []).filter((_, i) => i !== index);
      setEditedVideo({ ...editedVideo, tags: newTags });
    }
  };

  const handleSave = () => {
    if (editedVideo) {
      const videoToSave = {
        ...editedVideo,
        tags: (editedVideo.tags || []).filter(tag => tag.trim() !== '')
      };
      onSave(videoToSave);
      onClose();
    }
  };

  if (!editedVideo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Edit Video Lecture</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Video Title</Label>
                <Input
                  value={editedVideo.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter video title"
                />
              </div>

              <div>
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={editedVideo.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter video description"
                  rows={4}
                />
              </div>

              <div>
                <Label className="text-slate-300">CFA Level</Label>
                <Select value={editedVideo.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {levels.map(level => (
                      <SelectItem key={level} value={level} className="text-white">{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Subject</Label>
                <Select value={editedVideo.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject} className="text-white">{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Chapter</Label>
                <Input
                  value={editedVideo.chapter}
                  onChange={(e) => handleInputChange('chapter', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., Chapter 1"
                />
              </div>

              <div>
                <Label className="text-slate-300">Duration</Label>
                <Input
                  value={editedVideo.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., 45:32"
                />
              </div>

              <div>
                <Label className="text-slate-300">Status</Label>
                <Select value={editedVideo.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status} className="text-white capitalize">{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Views</Label>
                <Input
                  type="number"
                  value={editedVideo.views}
                  onChange={(e) => handleInputChange('views', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Number of views"
                />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <Label className="text-slate-300">Tags</Label>
            <div className="space-y-2">
              {(editedVideo.tags || []).map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter tag"
                  />
                  {(editedVideo.tags || []).length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTag(index)}
                      className="border-slate-600 text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                <Plus size={16} className="mr-1" />
                Add Tag
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-600">
            <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
