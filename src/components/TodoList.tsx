import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Quote as QuoteIcon } from 'lucide-react';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// Danh sách quote dự phòng
const backupQuotes = [
  { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Your mind is for having ideas, not holding them.", author: "David Allen" }
];

interface TodoListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TodoList = ({ tasks, setTasks }: TodoListProps) => {
  const [newTask, setNewTask] = useState('');
  const [quote, setQuote] = useState(backupQuotes[0]);

  useEffect(() => {
    if (tasks.length === 0) {
      const fetchQuote = async () => {
        try {
          const response = await fetch('https://api.api-ninjas.com/v2/randomquotes?categories=success,wisdom', {
            headers: { 'X-Api-Key': '7rk4MKnNmwhwFUEsYxvJdVDwy1pqIoSvzDgzFAO9' },
          });
          const data = await response.json();
          if (data && data.length > 0) setQuote(data[0]);
        } catch (error) {
          setQuote(backupQuotes[Math.floor(Math.random() * backupQuotes.length)]);
        }
      };
      fetchQuote();
    }
  }, [tasks.length]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task: Task = {
      id: uuidv4(),
      text: newTask,
      completed: false,
      priority: 'medium',
      tags: [],
      createdAt: Date.now()
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col gap-8 h-full max-w-4xl mx-auto py-4 w-full">
      <style>{`
        .quote-card-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 300px;
          margin-top: 50px;
        }

        .quote-main {
          background: #0a3cff !important;
          border-radius: 24px;
          padding: 40px;
          color: white;
          width: 100%;
          max-width: 450px;
          position: relative;
          z-index: 3; /* Cao nhất */
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.4s ease;
        }

        .quote-layer-1 {
          position: absolute;
          background: #ced8ff;
          width: 90%;
          height: 100%;
          border-radius: 24px;
          top: -10px;
          z-index: 2; /* Dưới lớp chính */
          opacity: 0.5; /* Mờ 50% */
          transition: all 0.4s ease;
        }

        .quote-layer-2 {
          position: absolute;
          background: #e7ecff;
          width: 80%;
          height: 100%;
          border-radius: 24px;
          top: -20px;
          z-index: 1; /* Dưới cùng */
          opacity: 0.5; /* Mờ 50% */
          transition: all 0.4s ease;
        }

        .quote-card-container:hover .quote-main { transform: translateY(-5px); }
        .quote-card-container:hover .quote-layer-1 { transform: rotate(-5deg) translateY(5px); opacity: 0.7; }
        .quote-card-container:hover .quote-layer-2 { transform: rotate(5deg) translateY(10px); opacity: 0.7; }
      `}</style>

      {/* Input Section - Phải luôn hiện */}
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-black tracking-tighter text-white uppercase">Tasks</h2>
        <form onSubmit={addTask} className="flex gap-3 bg-white/10 p-2 rounded-[24px] border border-white/10 backdrop-blur-md shadow-xl">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Write your next task..."
            className="flex-1 bg-transparent px-6 py-3 text-white outline-none font-bold placeholder:text-white/20"
          />
          <button type="submit" className="bg-white text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-50 transition-all active:scale-90 shadow-lg">
            <Plus className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {tasks.length > 0 ? (
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 p-5 rounded-[24px] border border-white/5 transition-all"
                >
                  <button onClick={() => toggleTask(task.id)} className="text-white/40 hover:text-white">
                    {task.completed ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Circle className="w-6 h-6" />}
                  </button>
                  <span className={cn("flex-1 font-bold text-lg text-white", task.completed && "line-through opacity-30")}>
                    {task.text}
                  </span>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            /* TRẠNG THÁI TRỐNG: HIỆN QUOTE */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="quote-card-container"
            >
              <div className="quote-main">
                <QuoteIcon className="w-10 h-10 text-white/20 mb-4" />
                <p className="font-bold text-xl italic leading-relaxed text-white">"{quote.quote}"</p>
                <p className="text-orange-400 font-black uppercase tracking-widest mt-6 text-sm">— {quote.author}</p>
              </div>
              <div className="quote-layer-1"></div>
              <div className="quote-layer-2"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};