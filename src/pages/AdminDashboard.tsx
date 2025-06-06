
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { DashboardOverview } from '@/components/DashboardOverview';
import { TestManagement } from '@/components/TestManagement';
import { FlashcardManagement } from '@/components/FlashcardManagement';
import { VideoManagement } from '@/components/VideoManagement';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'tests':
        return <TestManagement />;
      case 'flashcards':
        return <FlashcardManagement />;
      case 'videos':
        return <VideoManagement />;
      case 'students':
        return (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Student Management</h1>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        );
      case 'subjects':
        return (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Subject Management</h1>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        );
      case 'levels':
        return (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">CFA Level Management</h1>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        );
      case 'chapters':
        return (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Chapter Management</h1>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Analytics</h1>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Settings</h1>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h2 className="text-lg">Welcome back, {user?.username}</h2>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
