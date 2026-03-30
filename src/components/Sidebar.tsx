import React from 'react';
import { CheckSquare, FileText, Share2, Settings, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const navItems = [
    { id: 'todo' as View, label: 'Tasks', icon: CheckSquare },
    { id: 'notes' as View, label: 'Notes', icon: FileText },
    { id: 'calendar' as View, label: 'Calendar', icon: CalendarIcon },
    { id: 'mindmap' as View, label: 'Mind Map', icon: Share2 },
  ];

  return (
    <aside className="w-64 h-full glass-panel border-r-0 rounded-r-[40px] flex flex-col p-8 z-10 shadow-2xl">
      <style>{`
        .crystal-container { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; }
        .crystal-loader { position: relative; width: 40px; height: 40px; perspective: 200px; }
        .crystal { position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; opacity: 0; transform-origin: bottom center;
          transform: translate(-50%, -50%) rotateX(45deg); animation: crystal-spin 4s linear infinite, crystal-emerge 2s ease-in-out infinite alternate, crystal-fadeIn 0.3s ease-out forwards;
          border-radius: 2px; visibility: hidden; }
        @keyframes crystal-spin { from { transform: translate(-50%, -50%) rotateX(45deg) rotateZ(0deg); }
          to { transform: translate(-50%, -50%) rotateX(45deg) rotateZ(360deg); } }
        @keyframes crystal-emerge { 0%, 100% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; } 50% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
        @keyframes crystal-fadeIn { to { visibility: visible; opacity: 0.8; } }
        .crystal:nth-child(1) { background: linear-gradient(45deg, #003366, #336699); animation-delay: 0s; }
        .crystal:nth-child(2) { background: linear-gradient(45deg, #003399, #3366cc); animation-delay: 0.3s; }
        .crystal:nth-child(3) { background: linear-gradient(45deg, #0066cc, #3399ff); animation-delay: 0.6s; }
        .crystal:nth-child(4) { background: linear-gradient(45deg, #0099ff, #66ccff); animation-delay: 0.9s; }
      `}</style>

      <div className="flex items-center gap-4 mb-12 px-2">
        {/* NEW LOGO LOADER */}
        <div className="crystal-container bg-white/10 rounded-2xl shadow-xl">
          <div className="crystal-loader">
            <div className="crystal"></div>
            <div className="crystal"></div>
            <div className="crystal"></div>
            <div className="crystal"></div>
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Aurora</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              'flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden',
              currentView === item.id
                ? 'bg-white/20 text-white shadow-xl ring-1 ring-white/30'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            )}
          >
            <item.icon className={cn(
              'w-5 h-5 transition-all duration-500',
              currentView === item.id ? 'scale-110 text-yellow-400' : 'group-hover:scale-110 group-hover:text-white'
            )} />
            <span className="font-semibold tracking-tight">{item.label}</span>
            {currentView === item.id && (
              <div className="ml-auto w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(255,209,45,1)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-2">
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/50 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};
