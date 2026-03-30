import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Quote as QuoteIcon } from 'lucide-react';
import { Task } from '../types';
import { Button } from './Button';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TodoListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TodoList = ({ tasks, setTasks }: TodoListProps) => {
  const [newTask, setNewTask] = useState('');
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);

  // Fetch Quote từ API Ninjas khi hết task
  useEffect(() => {
    if (tasks.length === 0) {
      const fetchQuote = async () => {
        try {
          const response = await fetch('https://api.api-ninjas.com/v2/randomquotes?categories=success,wisdom', {
            headers: { 'X-Api-Key': '7rk4MKnNmwhwFUEsYxvJdVDwy1pqIoSvzDgzFAO9' }, // THAY KEY CỦA BẠN VÀO ĐÂY
          });
          const data = await response.json();
          if (data && data.length > 0) setQuote(data[0]);
        } catch (error) {
          setQuote({ quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" });
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
      createdAt: Date.now(),
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
    <div className="flex flex-col gap-8 h-full max-w-4xl mx-auto py-4">
      <style>{`
        .quote-card { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; max-width: 450px; transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1); margin-top: 40px; }
        .quote-content { 
          display: flex; flex-direction: column; align-items: flex-start; gap: 20px; padding: 36px; 
          border-radius: 22px; color: #ffffff; background: #0a3cff; position: relative; z-index: 10; width: 100%;
          transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
        }
        /* Lớp phụ 1 - Opacity 50% */
        .quote-content::before { 
          position: absolute; content: ""; top: -4%; left: 50%; width: 90%; height: 90%; transform: translate(-50%); 
          background: #ced8ff; z-index: -1; opacity: 0.5; border-radius: inherit; transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1); 
        }
        /* Lớp phụ 2 - Opacity 50% */
        .quote-content::after { 
          position: absolute; content: ""; top: -8%; left: 50%; width: 80%; height: 80%; transform: translate(-50%); 
          background: #e7ecff; z-index: -2; opacity: 0.5; border-radius: inherit; transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1); 
        }
        .quote-card:hover { transform: translateY(-15px); }
        .quote-card:hover .quote-content::before { rotate: -8deg; top: 0; width: 100%; height: 100%; opacity: 0.7; }
        .quote-card:hover .quote-content::after { rotate: 8deg; top: 0; width: 100%; height: 100%; opacity: 0.7; }
      `}</style>

      {/* PHẦN INPUT ĐỂ THÊM TASK - ĐẢM BẢO KHÔNG BỊ MẤT */}
      <div className="flex flex-col gap-4 z-20">
        <h2 className="text-4xl font-black tracking-tighter text-white">TASKS</h2>
        <form onSubmit={addTask} className="flex gap-3 bg-white/10 p-2 rounded-[24px] border border-white/10 backdrop-blur-md shadow-2xl">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Việc cần làm tiếp theo..."
            className="flex-1 bg-transparent px-6 py-3 text-white outline-none placeholder:text-white/30 font-bold"
          />
          <button type="submit" className="bg-white text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-50 transition-colors shadow-lg">
            <Plus className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* DANH SÁCH TASK HOẶC QUOTE CARD */}
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col items-center">
        <AnimatePresence mode="popLayout">
          {tasks.length > 0 ? (
            <div className="w-full">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 p-5 rounded-[24px] border border-white/5 mb-3 transition-all"
                >
                  <button onClick={() => toggleTask(task.id)} className="text-white/40 hover:text-white">
                    {task.completed ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Circle className="w-6 h-6" />}
                  </button>
                  <span className={cn("flex-1 font-bold text-lg text-white", task.completed && "line-through opacity-30")}>
                    {task.text}
                  </span>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            /* HIỂN THỊ QUOTE KHI KHÔNG CÓ TASK */
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-10 w-full"
            >
              <div className="quote-card">
                <div className="quote-content">
                  <QuoteIcon className="w-10 h-10 text-white/30 mb-2" />
                  <p className="font-bold text-xl italic leading-relaxed">"{quote?.quote}"</p>
                  <span className="text-sm font-black uppercase tracking-widest text-orange-400 mt-4">— {quote?.author}</span>
                </div>
              </div>
              <p className="text-white/20 font-black text-xs mt-12 tracking-[0.4em] uppercase">All caught up!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};