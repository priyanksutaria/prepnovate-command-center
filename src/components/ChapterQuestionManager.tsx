import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Plus, Eye, Trash2, Edit, Save, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TEST_ID_MAPPING, TestLevel, TestSubject, TestChapter } from './testMapping';

interface Question {
  id: string;
  question: string;
  options?: string[];
  answer?: string;
  explanation?: string;
}

interface ChapterQuestionManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

//const token = localStorage.getItem('authToken');


export const ChapterQuestionManager: React.FC<ChapterQuestionManagerProps> = ({ isOpen, onClose }) => {
  const [selectedLevel, setSelectedLevel] = useState<TestLevel>("Level I");
  const [selectedSubject, setSelectedSubject] = useState<TestSubject>("Ethics & Professional Standards");
  const [selectedChapter, setSelectedChapter] = useState<TestChapter>("Ethics and Trust in the Investment Profession");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bulkQuestionsJson, setBulkQuestionsJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState<{
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
  }>({
    question: '',
    options: ['', '', ''],
    answer: '',
    explanation: ''
  });

  const [newQuestion, setNewQuestion] = useState<{
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
  }>({
    question: '',
    options: ['', '', ''],
    answer: '',
    explanation: ''
  });

  // Get all available levels
  const levels = Object.keys(TEST_ID_MAPPING) as TestLevel[];

  // Get subjects for selected level
  const subjects = selectedLevel 
    ? Object.keys(TEST_ID_MAPPING[selectedLevel]) as TestSubject[] 
    : [];

  // Get chapters for selected subject
  const chapters = selectedLevel && selectedSubject 
    ? Object.keys(TEST_ID_MAPPING[selectedLevel][selectedSubject]) as TestChapter[] 
    : [];

  const showMessage = (message: string, type: 'success' | 'error') => {
    // Simple alert for now - you can replace with a proper toast notification
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const handleLoadQuestions = async () => {
    if (!selectedLevel || !selectedSubject || !selectedChapter) return;

    const testnum = TEST_ID_MAPPING[selectedLevel]?.[selectedSubject]?.[selectedChapter];

    if (!testnum) {
      showMessage('No test ID found for selected chapter', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://prepnovate-backend.onrender.com/api/test/getTest?testnum=${testnum}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data.data.questions || []);
      showMessage('Questions loaded successfully', 'success');
    } catch (error) {
      console.error('Error loading questions:', error);
      showMessage('Error loading questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    const token = localStorage.getItem('authToken');

    if (
      !newQuestion.question.trim() ||
      newQuestion.options.some((opt) => !opt.trim()) ||
      !newQuestion.answer.trim() ||
      !selectedLevel ||
      !selectedSubject ||
      !selectedChapter
    ) {
      showMessage('Please fill all required fields', 'error');
      return;
    }

    const testnum = TEST_ID_MAPPING[selectedLevel]?.[selectedSubject]?.[selectedChapter];
    if (!testnum) {
      showMessage('No test ID found for selected chapter', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://prepnovate-backend.onrender.com/api/test/addQuestion',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include Bearer token
          },
          body: JSON.stringify({
            testnum: testnum,
            question: newQuestion,
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to add question');

      setNewQuestion({
        question: '',
        options: ['', '', ''],
        answer: '',
        explanation: ''
      });
      showMessage('Question added successfully', 'success');
      await handleLoadQuestions();
    } catch (error) {
      console.error('Error adding question:', error);
      showMessage('Error adding question', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string, questionIndex: number) => {

    const token = localStorage.getItem('authToken');
    if (!selectedLevel || !selectedSubject || !selectedChapter) {
      showMessage('Please select level, subject and chapter', 'error');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this question?');
    if (!confirmDelete) return;

    const testnum = TEST_ID_MAPPING[selectedLevel]?.[selectedSubject]?.[selectedChapter];
    if (!testnum) {
      showMessage('No test ID found for selected chapter', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://prepnovate-backend.onrender.com/api/test/deleteQuestion', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include Bearer token
        },
        body: JSON.stringify({
          testnum: String(testnum),
          questionNo: questionIndex + 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      showMessage('Question deleted successfully', 'success');
      await handleLoadQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      showMessage('Error deleting question', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question: Question, index: number) => {
    setEditingQuestionId(question.id);
    setEditQuestion({
      question: question.question,
      options: question.options || ['', '', ''],
      answer: question.answer || '',
      explanation: question.explanation || ''
    });
  };

  const handleUpdateQuestion = async (questionIndex: number) => {

    const token = localStorage.getItem('authToken');

    if (
      !editQuestion.question.trim() ||
      editQuestion.options.some((opt) => !opt.trim()) ||
      !editQuestion.answer.trim()
    ) {
      showMessage('Please fill all required fields', 'error');
      return;
    }

    const testnum = TEST_ID_MAPPING[selectedLevel]?.[selectedSubject]?.[selectedChapter];
    if (!testnum) {
      showMessage('No test ID found for selected chapter', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://prepnovate-backend.onrender.com/api/test/updateQuestion', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include Bearer token
        },
        body: JSON.stringify({
          testnum: String(testnum),
          questionNo: questionIndex + 1,
          question: editQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      showMessage('Question updated successfully', 'success');
      setEditingQuestionId(null);
      setEditQuestion({
        question: '',
        options: ['', '', ''],
        answer: '',
        explanation: ''
      });
      await handleLoadQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
      showMessage('Error updating question', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    const token = localStorage.getItem('authToken');
    if (!selectedLevel || !selectedSubject || !selectedChapter || !bulkQuestionsJson.trim()) {
      showMessage('Please select level, subject, chapter and add questions JSON', 'error');
      return;
    }

    const testnum = TEST_ID_MAPPING[selectedLevel]?.[selectedSubject]?.[selectedChapter];
    if (!testnum) {
      showMessage('No test ID found for selected chapter', 'error');
      return;
    }

    setLoading(true);
    try {
      const questions = JSON.parse(bulkQuestionsJson);

      if (!Array.isArray(questions)) {
        throw new Error('JSON must be an array of questions');
      }

      const response = await fetch('https://prepnovate-backend.onrender.com/api/test/addBulkQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include Bearer token
        },
        body: JSON.stringify({
          testnum: String(testnum),
          questions: questions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload bulk questions');
      }

      showMessage('Bulk questions uploaded successfully', 'success');
      setBulkQuestionsJson('');
      await handleLoadQuestions();
    } catch (error) {
      console.error('Error uploading bulk questions:', error);
      showMessage(`Error uploading bulk questions: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingQuestionId(null);
    setEditQuestion({
      question: '',
      options: ['', '', ''],
      answer: '',
      explanation: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Chapter Question Manager</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selection Controls */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Select Chapter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-slate-300">CFA Level</Label>
                  <Select value={selectedLevel} onValueChange={v => setSelectedLevel(v as TestLevel)}>
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
                    value={selectedSubject} 
                    onValueChange={v => setSelectedSubject(v as TestSubject)}
                    disabled={!selectedLevel}
                  >
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">Chapter</Label>
                  <Select 
                    value={selectedChapter} 
                    onValueChange={v => setSelectedChapter(v as TestChapter)}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {chapters.map(chapter => (
                        <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleLoadQuestions}
                  disabled={!selectedLevel || !selectedSubject || !selectedChapter || loading}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                >
                  <Eye className="mr-2" size={16} />
                  {loading ? 'Loading...' : 'Load Chapter Questions'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Question Management */}
          {selectedLevel && selectedSubject && selectedChapter && (
            <Tabs defaultValue="questions" className="bg-slate-700 rounded-lg">
              <TabsList className="bg-slate-600">
                <TabsTrigger value="questions" className="text-white">Current Questions ({questions.length})</TabsTrigger>
                <TabsTrigger value="add" className="text-white">Add Question</TabsTrigger>
                <TabsTrigger value="bulk" className="text-white">Bulk Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="p-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {questions.map((question, index) => (
                    <div key={question.id} className="bg-slate-600 p-4 rounded-lg">
                      {editingQuestionId === question.id ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <div>
                            <Label className="text-slate-300">Question</Label>
                            <Textarea
                              value={editQuestion.question}
                              onChange={(e) => setEditQuestion({ ...editQuestion, question: e.target.value })}
                              className="bg-slate-500 border-slate-400 text-white"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Options</Label>
                            <div className="space-y-2">
                              {editQuestion.options.map((opt, idx) => (
                                <Input
                                  key={idx}
                                  value={opt}
                                  onChange={(e) => {
                                    const updatedOptions = [...editQuestion.options];
                                    updatedOptions[idx] = e.target.value;
                                    setEditQuestion({ ...editQuestion, options: updatedOptions });
                                  }}
                                  className="bg-slate-500 border-slate-400 text-white"
                                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label className="text-slate-300">Correct Answer</Label>
                            <Select
                              value={editQuestion.answer}
                              onValueChange={(value) => setEditQuestion({ ...editQuestion, answer: value })}
                            >
                              <SelectTrigger className="bg-slate-500 border-slate-400 text-white">
                                <SelectValue placeholder="Select correct answer" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600">
                                {['A', 'B', 'C'].map((letter, idx) => (
                                  <SelectItem key={letter} value={letter}>
                                    {letter}: {editQuestion.options[idx] || `Option ${letter}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-slate-300">Explanation (Optional)</Label>
                            <Textarea
                              value={editQuestion.explanation}
                              onChange={(e) => setEditQuestion({ ...editQuestion, explanation: e.target.value })}
                              className="bg-slate-500 border-slate-400 text-white"
                              rows={2}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleUpdateQuestion(index)}
                              disabled={loading}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              <Save size={14} className="mr-1" />
                              Save
                            </Button>
                            <Button
                              onClick={cancelEdit}
                              variant="outline"
                              className="border-slate-400 text-slate-300 hover:bg-slate-500"
                              size="sm"
                            >
                              <X size={14} className="mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-white font-medium">Q{index + 1}: {question.question}</div>
                            <div className="text-slate-300 text-sm mt-2">
                              Correct Answer: {question.answer}
                            </div>
                            {question.options && question.options.length > 0 && (
                              <div className="text-slate-300 text-sm mt-2">
                                Options:
                                <ul className="list-disc list-inside ml-4">
                                  {question.options.map((opt, idx) => (
                                    <li key={idx}>{String.fromCharCode(65 + idx)}: {opt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {question.explanation && (
                              <div className="text-slate-400 text-sm mt-1">
                                Explanation: {question.explanation}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditQuestion(question, index)}
                              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteQuestion(question.id, index)}
                              disabled={loading}
                              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      No questions found for this chapter
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="add" className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Question</Label>
                    <Textarea
                      value={newQuestion.question}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, question: e.target.value })
                      }
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Enter your question"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Options</Label>
                    <div className="space-y-2">
                      {newQuestion.options.map((opt, idx) => (
                        <Input
                          key={idx}
                          value={opt}
                          onChange={(e) => {
                            const updatedOptions = [...newQuestion.options];
                            updatedOptions[idx] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: updatedOptions });
                          }}
                          className="bg-slate-600 border-slate-500 text-white"
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Correct Answer</Label>
                    <Select
                      value={newQuestion.answer}
                      onValueChange={(value) =>
                        setNewQuestion({ ...newQuestion, answer: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {['A', 'B', 'C'].map((letter, idx) => (
                          <SelectItem key={letter} value={letter}>
                            {letter}: {newQuestion.options[idx] || `Option ${letter}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Explanation (Optional)</Label>
                    <Textarea
                      value={newQuestion.explanation}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, explanation: e.target.value })
                      }
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Enter explanation for the answer"
                      rows={2}
                    />
                  </div>

                  <Button
                    onClick={handleAddQuestion}
                    disabled={loading}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                  >
                    <Plus className="mr-2" size={16} />
                    {loading ? 'Adding...' : 'Add Question to Database'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="bulk" className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Bulk Questions JSON</Label>
                    <Textarea
                      value={bulkQuestionsJson}
                      onChange={(e) => setBulkQuestionsJson(e.target.value)}
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Paste JSON array of questions here..."
                      rows={10}
                    />
                  </div>

                  <div className="text-slate-400 text-sm">
                    Expected format: Array of objects with properties: question, options, answer, explanation (optional)
                    <br />
                    {`Example: [{"question": "What is 2+2?", "options": ["2", "3", "4", "5"], "answer": "C", "explanation": "2+2 equals 4"}]`}
                  </div>

                  <Button
                    onClick={handleBulkUpload}
                    disabled={loading}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                  >
                    <Upload className="mr-2" size={16} />
                    {loading ? 'Uploading...' : 'Upload Questions to Database'}
                  </Button>
                </div>
              </TabsContent>

            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ChapterQuestionManager;
