
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Plus, Users, Clock, Target } from 'lucide-react';
import { QuestionEditDialog } from './QuestionEditDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  points: number;
}

interface Test {
  id: string;
  title: string;
  level: string;
  subject: string;
  chapter: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  questions: Question[];
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
}

interface TestDetailsViewProps {
  test: Test;
  onBack: () => void;
  onUpdateTest: (test: Test) => void;
}

export const TestDetailsView: React.FC<TestDetailsViewProps> = ({ test, onBack, onUpdateTest }) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsQuestionDialogOpen(true);
  };

  const handleSaveQuestion = (updatedQuestion: Question) => {
    const updatedQuestions = test.questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    onUpdateTest({ ...test, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = test.questions.filter(q => q.id !== questionId);
    onUpdateTest({ ...test, questions: updatedQuestions });
  };

  const toggleTestStatus = () => {
    const newStatus = test.status === 'active' ? 'draft' : 'active';
    onUpdateTest({ ...test, status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getQuestionTypeDisplay = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'true-false': return 'True/False';
      case 'essay': return 'Essay';
      default: return type;
    }
  };

  const totalPoints = test.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline" className="border-slate-600 text-slate-300">
            <ArrowLeft size={16} className="mr-2" />
            Back to Tests
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{test.title}</h1>
            <p className="text-slate-400">{test.level} • {test.subject} • {test.chapter}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(test.status)}`}>
            {test.status}
          </span>
          <Button 
            onClick={toggleTestStatus} 
            className={test.status === 'active' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {test.status === 'active' ? 'Set to Draft' : 'Activate Test'}
          </Button>
        </div>
      </div>

      {/* Test Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-600 p-2 rounded-lg">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Questions</p>
              <p className="text-white text-xl font-bold">{test.questions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-600 p-2 rounded-lg">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Points</p>
              <p className="text-white text-xl font-bold">{totalPoints}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-600 p-2 rounded-lg">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Time Limit</p>
              <p className="text-white text-xl font-bold">{test.timeLimit}m</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-600 p-2 rounded-lg">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Passing Score</p>
              <p className="text-white text-xl font-bold">{test.passingScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Description */}
      {test.description && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-white font-semibold mb-2">Description</h3>
          <p className="text-slate-300">{test.description}</p>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-semibold text-lg">Questions</h3>
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Plus size={16} className="mr-2" />
            Add Question
          </Button>
        </div>

        {test.questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No questions added yet</p>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white mt-4">
              <Plus size={16} className="mr-2" />
              Add First Question
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {test.questions.map((question, index) => (
              <div key={question.id} className="bg-slate-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-cyan-600 text-white px-2 py-1 rounded text-sm font-medium">
                        Q{index + 1}
                      </span>
                      <span className="text-slate-300 text-sm">
                        {getQuestionTypeDisplay(question.type)} • {question.points} points
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{question.question}</p>
                    
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <span className={`text-sm px-2 py-1 rounded ${
                              question.correctAnswer === optIndex 
                                ? 'bg-green-600 text-white' 
                                : 'bg-slate-600 text-slate-300'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className="text-slate-300 text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'true-false' && (
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-300 text-sm">Correct Answer:</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          question.correctAnswer === 'true' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-red-600 text-white'
                        }`}>
                          {question.correctAnswer?.toString().toUpperCase()}
                        </span>
                      </div>
                    )}

                    {question.explanation && (
                      <div className="mt-2 p-2 bg-slate-600 rounded">
                        <p className="text-slate-300 text-sm"><strong>Explanation:</strong> {question.explanation}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditQuestion(question)}
                      className="border-slate-600 text-slate-300 hover:text-white"
                    >
                      <Edit size={14} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-800 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Delete Question</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-300">
                            Are you sure you want to delete this question? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-slate-600 text-slate-300">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <QuestionEditDialog
        isOpen={isQuestionDialogOpen}
        onClose={() => setIsQuestionDialogOpen(false)}
        question={editingQuestion}
        onSave={handleSaveQuestion}
      />
    </div>
  );
};
