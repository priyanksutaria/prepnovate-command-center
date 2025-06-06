
import React from 'react';
import { Users, FileText, CreditCard, Video, TrendingUp, Award } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend?: string }> = ({ 
  title, value, icon, trend 
}) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && (
          <p className="text-cyan-400 text-sm mt-1 flex items-center">
            <TrendingUp size={14} className="mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className="text-cyan-400">{icon}</div>
    </div>
  </div>
);

export const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Manage your CFA learning platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value="2,847" 
          icon={<Users size={24} />} 
          trend="+12% this month"
        />
        <StatCard 
          title="Active Tests" 
          value="156" 
          icon={<FileText size={24} />} 
          trend="+8 new tests"
        />
        <StatCard 
          title="Flashcard Sets" 
          value="89" 
          icon={<CreditCard size={24} />} 
          trend="+15 this week"
        />
        <StatCard 
          title="Video Lectures" 
          value="234" 
          icon={<Video size={24} />} 
          trend="+5 uploaded"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Award className="mr-2 text-cyan-400" size={20} />
            CFA Level Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Level I</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <span className="text-white font-medium">1,850</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Level II</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
                <span className="text-white font-medium">717</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Level III</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{width: '10%'}}></div>
                </div>
                <span className="text-white font-medium">280</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">New test added: Ethics & Professional Standards</p>
                <p className="text-slate-400 text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">Flashcard set updated: Quantitative Methods</p>
                <p className="text-slate-400 text-xs">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">Video lecture uploaded: Fixed Income</p>
                <p className="text-slate-400 text-xs">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
