
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, BarChart3, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <GraduationCap className="mx-auto text-cyan-400 mb-4" size={64} />
          <h1 className="text-5xl font-bold text-white mb-4">EdNovate</h1>
          <p className="text-xl text-slate-300 mb-8">CFA Learning Platform Administration</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <Users className="text-cyan-400 mb-3" size={32} />
            <h3 className="text-white font-semibold mb-2">Student Management</h3>
            <p className="text-slate-400 text-sm">Manage student accounts and progress</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <BarChart3 className="text-cyan-400 mb-3" size={32} />
            <h3 className="text-white font-semibold mb-2">Content Management</h3>
            <p className="text-slate-400 text-sm">Create and manage tests, flashcards, and videos</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <GraduationCap className="text-cyan-400 mb-3" size={32} />
            <h3 className="text-white font-semibold mb-2">Analytics</h3>
            <p className="text-slate-400 text-sm">Track performance and engagement</p>
          </div>
        </div>
        
        <Link to="/admin">
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 text-lg">
            Access Admin Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
