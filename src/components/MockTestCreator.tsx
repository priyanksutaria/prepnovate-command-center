import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Plus, Save, Target } from 'lucide-react';
import { TEST_ID_MAPPING, TestLevel, TestSubject } from './testMapping';

interface ChapterWeightage {
  chapter: string;
  chapterCode: string;
  weightage: number;
  enabled: boolean;
}

interface MockTestCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTest: (testData: any) => void;
}

export const MockTestCreator: React.FC<MockTestCreatorProps> = ({ isOpen, onClose, onCreateTest }) => {
  const [testData, setTestData] = useState({
    title: '',
    level: '' as TestLevel | '',
    subject: '' as TestSubject | '',
    description: '',
    totalQuestions: 50,
    timeLimit: 90,
    passingScore: 70,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard' | 'mixed'
  });

  const [chapterWeightages, setChapterWeightages] = useState<ChapterWeightage[]>([]);

  // Get available levels from TEST_ID_MAPPING
  const levels = Object.keys(TEST_ID_MAPPING) as TestLevel[];

  // Get subjects for the selected level
  const getSubjectsForLevel = (level: TestLevel): TestSubject[] => {
    if (!level || !TEST_ID_MAPPING[level]) return [];
    return Object.keys(TEST_ID_MAPPING[level]) as TestSubject[];
  };

  // Get chapters for the selected level and subject
  const getChaptersForSubject = (level: TestLevel, subject: TestSubject) => {
    if (!level || !subject || !TEST_ID_MAPPING[level] || !TEST_ID_MAPPING[level][subject]) return {};
    return TEST_ID_MAPPING[level][subject];
  };

  const handleLevelChange = (level: TestLevel) => {
    setTestData({ ...testData, level, subject: '' });
    setChapterWeightages([]);
  };

  const handleSubjectChange = (subject: TestSubject) => {
    setTestData({ ...testData, subject });
    
    if (!testData.level) return;
    
    // Get chapters from the mapping
    const subjectChapters = getChaptersForSubject(testData.level, subject);
    const chapterEntries = Object.entries(subjectChapters);
    
    // Initialize chapter weightages
    const evenWeightage = Math.floor(100 / chapterEntries.length);
    const newWeightages: ChapterWeightage[] = chapterEntries.map(([chapterName, chapterCode], index) => ({
      chapter: chapterName,
      chapterCode,
      weightage: index === chapterEntries.length - 1 
        ? 100 - (evenWeightage * (chapterEntries.length - 1)) // Last chapter gets remainder
        : evenWeightage,
      enabled: true
    }));
    
    setChapterWeightages(newWeightages);
  };

  const updateChapterWeightage = (chapterIndex: number, newWeightage: number) => {
    const updated = [...chapterWeightages];
    updated[chapterIndex].weightage = newWeightage;
    setChapterWeightages(updated);
  };

  const toggleChapter = (chapterIndex: number) => {
    const updated = [...chapterWeightages];
    updated[chapterIndex].enabled = !updated[chapterIndex].enabled;
    
    // Redistribute weightage if disabling
    if (!updated[chapterIndex].enabled) {
      const enabledChapters = updated.filter(c => c.enabled);
      if (enabledChapters.length > 0) {
        const redistributedWeight = Math.floor(updated[chapterIndex].weightage / enabledChapters.length);
        enabledChapters.forEach(chapter => {
          const index = updated.findIndex(c => c.chapter === chapter.chapter);
          updated[index].weightage += redistributedWeight;
        });
        updated[chapterIndex].weightage = 0;
      }
    }
    
    setChapterWeightages(updated);
  };

  const getTotalWeightage = () => {
    return chapterWeightages.reduce((sum, chapter) => sum + (chapter.enabled ? chapter.weightage : 0), 0);
  };

  const getEstimatedQuestions = (chapter: ChapterWeightage) => {
    if (!chapter.enabled) return 0;
    return Math.round((chapter.weightage / 100) * testData.totalQuestions);
  };

  const handleCreateTest = async () => {
    const enabledChapters = chapterWeightages.filter(c => c.enabled);
    
    // Prepare data in the format expected by the backend
    const backendPayload = {
      name: testData.title,
      noofquestions: testData.totalQuestions,
      timelimit: testData.timeLimit,
      passingscore: testData.passingScore,
      description: testData.description,
      // Use chapter codes as keys for weightage mapping
      weightage: enabledChapters.reduce((acc, chapter) => {
        acc[chapter.chapterCode] = chapter.weightage;
        return acc;
      }, {} as Record<string, number>)
    };

    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch('https://prepnovate-backend.onrender.com/api/test/addMockTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendPayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Mock test created successfully:', result);
        
        // Pass the full config including backend response to parent
        const mockTestConfig = {
          ...testData,
          chapters: enabledChapters,
          totalWeightage: getTotalWeightage(),
          estimatedQuestions: enabledChapters.map(chapter => ({
            chapter: chapter.chapter,
            chapterCode: chapter.chapterCode,
            questions: getEstimatedQuestions(chapter),
            weightage: chapter.weightage
          })),
          createdAt: new Date().toISOString(),
          status: 'created',
          backendResponse: result
        };
        
        onCreateTest(mockTestConfig);
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Failed to create mock test:', errorData);
        alert(`Failed to create test: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating mock test:', error);
      alert('Network error: Failed to create test. Please try again.');
    }
  };

  const currentSubjects = testData.level ? getSubjectsForLevel(testData.level) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Create Subject-wise Mock Test</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Test Information */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Test Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Test Title</Label>
                  <Input
                    value={testData.title}
                    onChange={(e) => setTestData({...testData, title: e.target.value})}
                    className="bg-slate-600 border-slate-500 text-white"
                    placeholder="Enter test title"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">CFA Level</Label>
                  <Select value={testData.level} onValueChange={handleLevelChange}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">Subject</Label>
                  <Select 
                    value={testData.subject} 
                    onValueChange={handleSubjectChange}
                    disabled={!testData.level}
                  >
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {currentSubjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">Total Questions</Label>
                  <Input
                    type="number"
                    value={testData.totalQuestions}
                    onChange={(e) => setTestData({...testData, totalQuestions: parseInt(e.target.value) || 0})}
                    className="bg-slate-600 border-slate-500 text-white"
                    min="1"
                    max="200"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Time Limit (minutes)</Label>
                  <Input
                    type="number"
                    value={testData.timeLimit}
                    onChange={(e) => setTestData({...testData, timeLimit: parseInt(e.target.value) || 0})}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Passing Score (%)</Label>
                  <Input
                    type="number"
                    value={testData.passingScore}
                    onChange={(e) => setTestData({...testData, passingScore: parseInt(e.target.value) || 0})}
                    className="bg-slate-600 border-slate-500 text-white"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Label className="text-slate-300">Test Difficulty</Label>
                <Select value={testData.difficulty} onValueChange={(value) => setTestData({...testData, difficulty: value as any})}>
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="mixed">Mixed (Easy, Medium, Hard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={testData.description}
                  onChange={(e) => setTestData({...testData, description: e.target.value})}
                  className="bg-slate-600 border-slate-500 text-white"
                  placeholder="Enter test description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chapter Weightage Configuration */}
          {testData.subject && chapterWeightages.length > 0 && (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="mr-2" size={20} />
                  Chapter Weightage Configuration
                  <span className="ml-auto text-sm text-slate-300">
                    Total: {getTotalWeightage()}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chapterWeightages.map((chapter, index) => (
                    <div key={chapter.chapterCode} className="bg-slate-600 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={chapter.enabled}
                          onCheckedChange={() => toggleChapter(index)}
                          className="border-slate-400"
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium">{chapter.chapter}</div>
                          <div className="text-slate-300 text-sm">
                            Code: {chapter.chapterCode} • ~{getEstimatedQuestions(chapter)} questions
                          </div>
                        </div>
                        <div className="w-48">
                          <div className="flex items-center space-x-2">
                            <Slider
                              value={[chapter.weightage]}
                              onValueChange={(value) => updateChapterWeightage(index, value[0])}
                              max={100}
                              step={5}
                              disabled={!chapter.enabled}
                              className="flex-1"
                            />
                            <span className="text-white text-sm w-12">{chapter.weightage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {getTotalWeightage() !== 100 && (
                  <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600 rounded-lg">
                    <div className="text-yellow-200 text-sm">
                      Warning: Total weightage is {getTotalWeightage()}%. It should equal 100% for optimal question distribution.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTest}
              disabled={!testData.title || !testData.level || !testData.subject || getTotalWeightage() !== 100}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Save size={16} className="mr-2" />
              Generate Mock Test
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default MockTestCreator;