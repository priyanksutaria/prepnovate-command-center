
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Plus, Video } from 'lucide-react';

interface VideoUploadFormProps {
  onClose: () => void;
  onSave: (video: any) => void;
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: '',
    subject: '',
    chapter: '',
    tags: [''],
    thumbnail: null as File | null,
    videoFile: null as File | null,
  });

  const levels = ['Level I', 'Level II', 'Level III'];
  const subjects = ['Financial Analysis', 'Quantitative', 'Ethics', 'Portfolio', 'Economics', 'Corporate Finance'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleFileUpload = (field: 'thumbnail' | 'videoFile') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVideo = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      level: formData.level,
      subject: formData.subject,
      chapter: formData.chapter,
      duration: '00:00', // Will be calculated after upload
      views: 0,
      status: 'processing' as const,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: formData.tags.filter(tag => tag.trim() !== ''),
      thumbnail: formData.thumbnail?.name || '',
      videoFile: formData.videoFile?.name || '',
    };
    onSave(newVideo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-xl">Upload New Video Lecture</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Video Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter video description"
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="text-slate-300">CFA Level *</Label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {levels.map(level => (
                        <SelectItem key={level} value={level} className="text-white">{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject} className="text-white">{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Chapter</Label>
                  <Input
                    value={formData.chapter}
                    onChange={(e) => handleInputChange('chapter', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., Chapter 1"
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Video File *</Label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload('videoFile')}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Video className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                      <p className="text-slate-300">{formData.videoFile ? formData.videoFile.name : 'Click to upload video file'}</p>
                      <p className="text-xs text-slate-500 mt-1">MP4, MOV, AVI up to 2GB</p>
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Thumbnail (Optional)</Label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload('thumbnail')}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                      <p className="text-slate-300">{formData.thumbnail ? formData.thumbnail.name : 'Click to upload thumbnail'}</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                    </label>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-slate-300">Tags</Label>
                  <div className="space-y-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={tag}
                          onChange={(e) => handleTagChange(index, e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter tag"
                        />
                        {formData.tags.length > 1 && (
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
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-600">
              <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <Upload size={16} className="mr-2" />
                Upload Video
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
