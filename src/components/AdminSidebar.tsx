
import React from 'react';
import { 
  Home, 
  FileText, 
  CreditCard, 
  Video, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings,
  GraduationCap,
  Layers,
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'tests', label: 'Manage Tests', icon: FileText },
  { id: 'flashcards', label: 'Flashcards', icon: CreditCard },
  { id: 'videos', label: 'Video Lectures', icon: Video },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'levels', label: 'CFA Levels', icon: GraduationCap },
  { id: 'chapters', label: 'Chapters', icon: Layers },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">EdNovate Admin</h1>
        <p className="text-slate-400 text-sm">CFA Learning Platform</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                activeSection === item.id 
                  ? "bg-cyan-600 text-white shadow-lg" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <h3 className="text-cyan-400 font-semibold mb-2">Quick Actions</h3>
        <button className="w-full flex items-center space-x-2 text-sm text-slate-300 hover:text-white transition-colors">
          <PlusCircle size={16} />
          <span>Add New Content</span>
        </button>
      </div>
    </div>
  );
};
