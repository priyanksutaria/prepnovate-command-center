
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Save } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  points: number;
}

interface TestCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (testData: any) => void;
}

export const TestCreationForm: React.FC<TestCreationFormProps> = ({ isOpen, onClose, onSave }) => {
  const [testData, setTestData] = useState({
    title: '',
    level: '',
    subject: '',
    chapter: '',
    description: '',
    timeLimit: 60,
    passingScore: 70,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    points: 1,
  });

  const addQuestion = () => {
    if (currentQuestion.question) {
      const newQuestion: Question = {
        ...currentQuestion,
        id: Date.now().toString(),
      } as Question;
      
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        points: 1,
      });
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestionOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || ['', '', '', ''])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleSave = () => {
    const completeTestData = {
      ...testData,
      questions,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
    };
    onSave(completeTestData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Create New Test</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Test Basic Information */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Test Information</h3>
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
                <Select value={testData.level} onValueChange={(value) => setTestData({...testData, level: value})}>
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Level I">Level I</SelectItem>
                    <SelectItem value="Level II">Level II</SelectItem>
                    <SelectItem value="Level III">Level III</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Subject</Label>
                <Select value={testData.subject} onValueChange={(value) => setTestData({...testData, subject: value})}>
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Ethics">Ethics & Professional Standards</SelectItem>
                    <SelectItem value="Quantitative">Quantitative Methods</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                    <SelectItem value="Financial Analysis">Financial Statement Analysis</SelectItem>
                    <SelectItem value="Corporate Finance">Corporate Finance</SelectItem>
                    <SelectItem value="Portfolio Management">Portfolio Management</SelectItem>
                    <SelectItem value="Equity">Equity Investments</SelectItem>
                    <SelectItem value="Fixed Income">Fixed Income</SelectItem>
                    <SelectItem value="Derivatives">Derivatives</SelectItem>
                    <SelectItem value="Alternative">Alternative Investments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Chapter</Label>
                <Input
                  value={testData.chapter}
                  onChange={(e) => setTestData({...testData, chapter: e.target.value})}
                  className="bg-slate-600 border-slate-500 text-white"
                  placeholder="Enter chapter"
                />
              </div>
              <div>
                <Label className="text-slate-300">Time Limit (minutes)</Label>
                <Input
                  type="number"
                  value={testData.timeLimit}
                  onChange={(e) => setTestData({...testData, timeLimit: parseInt(e.target.value)})}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Passing Score (%)</Label>
                <Input
                  type="number"
                  value={testData.passingScore}
                  onChange={(e) => setTestData({...testData, passingScore: parseInt(e.target.value)})}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
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
          </div>

          {/* Question Creation */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Add Question</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Question</Label>
                <Textarea
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                  className="bg-slate-600 border-slate-500 text-white"
                  placeholder="Enter your question"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Question Type</Label>
                  <Select value={currentQuestion.type} onValueChange={(value) => setCurrentQuestion({...currentQuestion, type: value as any})}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">Points</Label>
                  <Input
                    type="number"
                    value={currentQuestion.points}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value)})}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
              </div>

              {currentQuestion.type === 'multiple-choice' && (
                <div>
                  <Label className="text-slate-300">Answer Options</Label>
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-slate-300 w-6">{String.fromCharCode(65 + index)}.</span>
                        <Input
                          value={option}
                          onChange={(e) => updateQuestionOption(index, e.target.value)}
                          className="bg-slate-600 border-slate-500 text-white"
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label className="text-slate-300">Correct Answer</Label>
                    <Select value={currentQuestion.correctAnswer?.toString()} onValueChange={(value) => setCurrentQuestion({...currentQuestion, correctAnswer: parseInt(value)})}>
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="0">A</SelectItem>
                        <SelectItem value="1">B</SelectItem>
                        <SelectItem value="2">C</SelectItem>
                        <SelectItem value="3">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentQuestion.type === 'true-false' && (
                <div>
                  <Label className="text-slate-300">Correct Answer</Label>
                  <Select value={currentQuestion.correctAnswer?.toString()} onValueChange={(value) => setCurrentQuestion({...currentQuestion, correctAnswer: value})}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="text-slate-300">Explanation (Optional)</Label>
                <Textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                  className="bg-slate-600 border-slate-500 text-white"
                  placeholder="Explain the correct answer"
                  rows={2}
                />
              </div>

              <Button onClick={addQuestion} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <Plus size={16} className="mr-2" />
                Add Question
              </Button>
            </div>
          </div>

          {/* Questions List */}
          {questions.length > 0 && (
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-4">Questions ({questions.length})</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-slate-600 p-3 rounded flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-white font-medium">Q{index + 1}: {question.question}</div>
                      <div className="text-slate-300 text-sm mt-1">
                        Type: {question.type} | Points: {question.points}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeQuestion(question.id)}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Save size={16} className="mr-2" />
              Save Test
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
