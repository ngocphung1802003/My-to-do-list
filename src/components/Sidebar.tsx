import React from 'react';
import { CheckSquare, FileText, Share2, Calendar as CalendarIcon } from 'lucide-react';
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
      <div className="flex items-center gap-4 mb-12 px-2">
        {/* Quay lại logo Gradient cũ */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-yellow-400 flex items-center justify-center shadow-xl shadow-blue-500/30">
          <div className="w-5 h-5 rounded-full bg-white/40 blur-[1px]" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Aurora
        </h1>
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
    </aside>
  );
};