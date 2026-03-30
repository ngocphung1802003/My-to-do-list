/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TodoList } from './components/TodoList';
import { NotesView } from './components/NotesView';
import { MindMap } from './components/MindMap';
import { CalendarView } from './components/CalendarView';
import { View, Task, Note } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('todo');

  // State for data
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('aurora-tasks');
    if (saved) return JSON.parse(saved);

    return [{
      id: 'sample-1',
      text: 'Your To Do List',
      completed: false,
      priority: 'high',
      tags: ['career'],
      createdAt: Date.now()
    }];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('aurora-notes');
    return saved ? JSON.parse(saved) : [
      {
        id: 'welcome',
        title: 'Welcome to Aurora',
        content: '# Welcome!\n\nThis is your personal productivity space. \n\n- **Tasks**: Keep track of what matters.\n- **Notes**: Capture ideas in markdown.\n- **Mind Map**: Visualize connections.\n\nEverything is saved locally in your browser.',
        tags: ['welcome'],
        updatedAt: Date.now()
      }
    ];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('aurora-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('aurora-notes', JSON.stringify(notes));
  }, [notes]);

  const renderView = () => {
    switch (currentView) {
      case 'todo':
        return <TodoList tasks={tasks} setTasks={setTasks} />;
      case 'notes':
        return <NotesView notes={notes} setNotes={setNotes} />;
      case 'mindmap':
        return <MindMap />;
      case 'calendar':
        return <CalendarView tasks={tasks} notes={notes} />;
      default:
        return <TodoList tasks={tasks} setTasks={setTasks} />;
    }
  };

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-[#050505]">
      {/* Aurora Background Elements */}
      <div className="aurora-bg">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
        <div className="aurora-blob blob-4" />
      </div>
      <div className="grain-overlay" />

      {/* Main Layout */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 h-full p-8 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            /* HIỆU ỨNG CHUYỂN CẢNH MỚI: Trượt từ dưới lên (y: 20 -> 0) và Blur mượt */
            initial={{ opacity: 0, y: 20, filter: 'blur(15px)', scale: 0.99 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(15px)', scale: 0.99 }}
            transition={{
              duration: 0.5,
              ease: [0.23, 1, 0.32, 1] // Cubic-bezier tạo cảm giác chuyển động mượt mà của UI cao cấp
            }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Music Player - Floating ở trên cùng */}
      <MusicPlayer />

      {/* Floating Decorative Blobs (Tăng độ blur và kích thước để nền sâu hơn) */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}