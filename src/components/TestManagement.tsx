import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Database,
  Target,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { TestCreationForm } from './TestCreationForm';
import { TestDetailsView } from './TestDetailsView';
import { ChapterQuestionManager } from './ChapterQuestionManager';
import { MockTestCreator } from './MockTestCreator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  chapter?: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  questions: Question[];
  status: 'draft' | 'active' | 'archived' | 'generating';
  createdAt: string;
  testType?: 'manual' | 'mock';
}

export const TestManagement: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isQuestionManagerOpen, setIsQuestionManagerOpen] = useState(false);
  const [isMockTestCreatorOpen, setIsMockTestCreatorOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'details'>('list');

  // Utility to pick a background color for each status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'archived':
        return 'bg-gray-500';
      case 'generating':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Utility to choose an icon based on testType
  const getTypeIcon = (testType?: string) => {
    return testType === 'mock' ? <Target size={16} /> : <Edit size={16} />;
  };

  // Whenever the component mounts, fetch all mock tests from the backend
  useEffect(() => {
    const fetchAllMockTests = async () => {
      try {
        const resp = await fetch(
          'https://prepnovate-backend.onrender.com/api/test/getAllMockTest'
        );
        const json = await resp.json();
        if (json.success && Array.isArray(json.data)) {
          // Map each API object into your Test interface
          const mockTests: Test[] = json.data.map((item: any) => ({
            id: item._id,
            title: item.name,
            // We’ll also use “name” as subject, since the API doesn’t return a separate subject field
            subject: item.name,
            // If you have a default level or want to parse it differently, adjust here
            level: '',
            chapter: '',
            description: item.description || '',
            timeLimit: item.timelimit,
            passingScore: item.passingscore,
            // At first, we only know how many questions exist; actual questions[] will be fetched on “View”
            questions: Array(item.noofquestions).fill({} as Question),
            // You can choose a default “status”—for example, all mock tests start as “active”
            status: 'active',
            // We don't get createdAt from this endpoint, so leave it blank or fill with today’s date
            createdAt: new Date().toISOString().split('T')[0],
            testType: 'mock'
          }));
          setTests(mockTests);
        } else {
          console.error('Failed to fetch mock tests or data is malformed');
        }
      } catch (err) {
        console.error('Error fetching mock tests:', err);
      }
    };

    fetchAllMockTests();
  }, []);

  // Filter the tests array based on search, level, status, type
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || test.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus;
    const matchesType = filterType === 'all' || test.testType === filterType;
    return matchesSearch && matchesLevel && matchesStatus && matchesType;
  });

  // Handler when creating a new “manual” test (unchanged from before)
  const handleCreateTest = (testData: any) => {
    const newTest: Test = {
      ...testData,
      id: Date.now().toString(),
      testType: 'manual'
    };
    setTests([newTest, ...tests]);
    console.log('New manual test created:', newTest);
  };

  // Handler when creating a new “mock” test from your form (if you still want to support that)
  const handleCreateMockTest = (testData: any) => {
    const newTest: Test = {
      ...testData,
      id: Date.now().toString(),
      testType: 'mock',
      questions: [] // will be replaced when user clicks “View”
    };
    setTests([newTest, ...tests]);
    console.log('New mock test created:', newTest);
  };

  // When the user clicks “View” on a test row:
  // • If it’s a mock test, fetch real questions from API and then setSelectedTest → details view
  // • Otherwise (manual test), just go to details view with the existing object.
  const handleViewTest = async (test: Test) => {
    if (test.testType === 'mock') {
      try {
        // We use test.title as “name” parameter
        const resp = await fetch(
          `https://prepnovate-backend.onrender.com/api/test/getMockTest?name=${encodeURIComponent(
            test.title
          )}`
        );
        const json = await resp.json();
        if (json.success && json.data) {
          const fetched = json.data;
          // Map each returned question into your Question interface
          const questions: Question[] = fetched.questions.map((q: any) => ({
            id: q._id,
            question: q.question,
            type: 'multiple-choice',
            options: q.options,
            correctAnswer: q.answer,
            // You can leave explanation blank if the API doesn’t return one
            explanation: '',
            points: 1
          }));
          // Build a new Test object combining API fields + fetched questions
          const mappedTest: Test = {
            id: fetched._id,
            title: fetched.name,
            subject: fetched.name,
            level: '',
            chapter: '',
            description: fetched.description || '',
            timeLimit: fetched.timelimit,
            passingScore: fetched.passingscore,
            questions,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
            testType: 'mock'
          };
          setSelectedTest(mappedTest);
          setCurrentView('details');
        } else {
          console.error('Failed to fetch mock-test details or data is malformed');
        }
      } catch (err) {
        console.error('Error fetching mock-test details:', err);
      }
    } else {
      // Manual test – go straight to details view
      setSelectedTest(test);
      setCurrentView('details');
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTest(null);
  };

  const handleUpdateTest = (updatedTest: Test) => {
    setTests(tests.map((t) => (t.id === updatedTest.id ? updatedTest : t)));
    setSelectedTest(updatedTest);
    console.log('Test updated:', updatedTest);
  };

  const handleDeleteMockTest = async (testName: string) => {
    const token = localStorage.getItem('authToken'); // Get the token from local storage
    try {
      const response = await fetch('https://prepnovate-backend.onrender.com/api/test/deleteMockTest', {
        method: 'POST',
         headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include Bearer token
        },
        body: JSON.stringify({
          name: testName,
        }),
      });
      const json = await response.json();
      if (json.success) {
        // Remove the test from the local state
        setTests(tests.filter(test => test.title !== testName));
        console.log('Mock test deleted:', testName);
      } else {
        console.error('Failed to delete mock test:', json.message);
      }
    } catch (error) {
      console.error('Error deleting mock test:', error);
    }
  };

  // If we’re in “details” mode, render TestDetailsView
  if (currentView === 'details' && selectedTest) {
    return (
      <TestDetailsView
        test={selectedTest}
        onBack={handleBackToList}
        onUpdateTest={handleUpdateTest}
      />
    );
  }

  // Otherwise, show the full “list of tests” UI
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Test Management</h1>
          <p className="text-slate-400">
            Create manual tests, manage questions, and pull real mock tests from backend
          </p>
        </div>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="tests" className="text-white">
            All Tests
          </TabsTrigger>
          <TabsTrigger value="questions" className="text-white">
            Chapter Questions
          </TabsTrigger>
          <TabsTrigger value="mock" className="text-white">
            Mock Test Generator
          </TabsTrigger>
        </TabsList>

        {/* ─────────────── “All Tests” Tab ─────────────── */}
        <TabsContent value="tests">
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              onClick={() => setIsMockTestCreatorOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Target size={20} className="mr-2" />
              Generate Mock Test
            </Button>
            <Button
              onClick={() => setIsQuestionManagerOpen(true)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-white"
            >
              <Database size={20} className="mr-2" />
              Manage Questions
            </Button>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <Input
                    placeholder="Search tests by title or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by Level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Level I">Level I</SelectItem>
                  <SelectItem value="Level II">Level II</SelectItem>
                  <SelectItem value="Level III">Level III</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manual">Manual Tests</SelectItem>
                  <SelectItem value="mock">Mock Tests</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="generating">Generating</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-300 font-medium py-3">
                      Test Title
                    </th>
                    <th className="text-left text-slate-300 font-medium py-3">
                      Level
                    </th>
                    <th className="text-left text-slate-300 font-medium py-3">
                      Subject
                    </th>
                    <th className="text-left text-slate-300 font-medium py-3">
                      Type
                    </th>
                    <th className="text-left text-slate-300 font-medium py-3">
                      Questions
                    </th>
                    <th className="text-left text-slate-300 font-medium py-3">
                      Duration
                    </th>
                    <th className="text-left text-slate-300 font-medium py-3">
                      Status
                    </th>
                    <th className="text-left text-slate-300 font-medium py-3">
                      Created
                    </th>
                    <th className="text-left text-slate-300 font-medium py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map((test) => (
                    <tr
                      key={test.id}
                      className="border-b border-slate-700 hover:bg-slate-700"
                    >
                      <td className="py-4">
                        <div className="flex items-center">
                          <span className="mr-2 text-slate-400">
                            {getTypeIcon(test.testType)}
                          </span>
                          <div>
                            <div className="text-white font-medium">
                              {test.title}
                            </div>
                            {test.description && (
                              <div className="text-slate-400 text-sm line-clamp-2">
                                {test.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-300">{test.level}</td>
                      <td className="py-4 text-slate-300">{test.subject}</td>
                      <td className="py-4">
                        <span className="text-slate-300 capitalize">
                          {test.testType || 'manual'}
                        </span>
                      </td>
                      <td className="py-4 text-slate-300">
                        {test.questions.length}
                      </td>
                      <td className="py-4 text-slate-300">
                        {test.timeLimit}m
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                            test.status
                          )}`}
                        >
                          {test.status}
                        </span>
                      </td>
                      <td className="py-4 text-slate-300">
                        {test.createdAt}
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewTest(test)}
                            className="border-slate-600 text-slate-300 hover:text-white"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                                title="Delete Test"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-800 border-slate-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">
                                  Delete Test
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-300">
                                  Are you sure you want to delete &quot;{test.title}&quot;? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-slate-600 text-slate-300">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteMockTest(test.title)} // Call the delete function here
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTests.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">
                  No tests found matching your criteria
                </p>
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={() => setIsMockTestCreatorOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Target size={16} className="mr-2" />
                    Generate Mock Test
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ─────────────── “Chapter Questions” Tab ─────────────── */}
        <TabsContent value="questions">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="text-center py-12">
              <Database
                size={48}
                className="mx-auto text-slate-400 mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">
                Chapter Question Management
              </h3>
              <p className="text-slate-400 mb-6">
                Manage questions by chapter, add bulk questions via JSON, and
                view existing questions in the database.
              </p>
              <Button
                onClick={() => setIsQuestionManagerOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Database size={20} className="mr-2" />
                Open Question Manager
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ─────────────── “Mock Test Generator” Tab ─────────────── */}
        <TabsContent value="mock">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="text-center py-12">
              <Target
                size={48}
                className="mx-auto text-slate-400 mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">
                Subject-wise Mock Test Generator
              </h3>
              <p className="text-slate-400 mb-6">
                Create comprehensive mock tests by selecting chapters,
                configuring weightages, and letting the backend generate
                questions from your database.
              </p>
              <Button
                onClick={() => setIsMockTestCreatorOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Target size={20} className="mr-2" />
                Generate New Mock Test
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─────────── Modals / Dialogs ─────────── */}
      <TestCreationForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onSave={handleCreateTest}
      />

      <ChapterQuestionManager
        isOpen={isQuestionManagerOpen}
        onClose={() => setIsQuestionManagerOpen(false)}
      />

      <MockTestCreator
        isOpen={isMockTestCreatorOpen}
        onClose={() => setIsMockTestCreatorOpen(false)}
        onCreateTest={handleCreateMockTest}
      />
    </div>
  );
};
export default TestManagement;