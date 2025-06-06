
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  points: number;
}

interface QuestionEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  onSave: (question: Question) => void;
}

export const QuestionEditDialog: React.FC<QuestionEditDialogProps> = ({ isOpen, onClose, question, onSave }) => {
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (question) {
      setEditedQuestion({ ...question });
    }
  }, [question]);

  const updateQuestionOption = (index: number, value: string) => {
    if (!editedQuestion) return;
    const newOptions = [...(editedQuestion.options || ['', '', '', ''])];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  const handleSave = () => {
    if (editedQuestion) {
      onSave(editedQuestion);
      onClose();
    }
  };

  if (!editedQuestion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Edit Question</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Question</Label>
            <Textarea
              value={editedQuestion.question}
              onChange={(e) => setEditedQuestion({...editedQuestion, question: e.target.value})}
              className="bg-slate-600 border-slate-500 text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Question Type</Label>
              <Select value={editedQuestion.type} onValueChange={(value) => setEditedQuestion({...editedQuestion, type: value as any})}>
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
                value={editedQuestion.points}
                onChange={(e) => setEditedQuestion({...editedQuestion, points: parseInt(e.target.value)})}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>
          </div>

          {editedQuestion.type === 'multiple-choice' && (
            <div>
              <Label className="text-slate-300">Answer Options</Label>
              <div className="space-y-2">
                {editedQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-slate-300 w-6">{String.fromCharCode(65 + index)}.</span>
                    <Input
                      value={option}
                      onChange={(e) => updateQuestionOption(index, e.target.value)}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <Label className="text-slate-300">Correct Answer</Label>
                <Select value={editedQuestion.correctAnswer?.toString()} onValueChange={(value) => setEditedQuestion({...editedQuestion, correctAnswer: parseInt(value)})}>
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue />
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

          {editedQuestion.type === 'true-false' && (
            <div>
              <Label className="text-slate-300">Correct Answer</Label>
              <Select value={editedQuestion.correctAnswer?.toString()} onValueChange={(value) => setEditedQuestion({...editedQuestion, correctAnswer: value})}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-slate-300">Explanation</Label>
            <Textarea
              value={editedQuestion.explanation || ''}
              onChange={(e) => setEditedQuestion({...editedQuestion, explanation: e.target.value})}
              className="bg-slate-600 border-slate-500 text-white"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-3">
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
