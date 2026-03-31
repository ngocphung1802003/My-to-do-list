import React, { useState, useEffect } from 'react';
import { MagneticCard } from '../components/MagneticCard';
import { Plus, Trash2, CheckCircle2, Circle, Quote as QuoteIcon, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { format } from 'date-fns';


interface TodoListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TodoList = ({ tasks, setTasks }: TodoListProps) => {
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);
  const [chillPoints, setChillPoints] = useState(() => {
    const saved = localStorage.getItem('aurora-chill-points');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('aurora-chill-points', chillPoints.toString());
  }, [chillPoints]);

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
      dueDate: dueDate || undefined,
      tags: [],
      createdAt: Date.now(),
    };
    setTasks([task, ...tasks]);
    setNewTask('');
    setDueDate('');
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      confetti({
        particleCount: 100,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#e757faff', '#3b82f6', '#ffffff']
      });
      setChillPoints(prev => prev + 20);
    }
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completionRate = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) : 0;

  return (
    <div className="flex flex-col gap-6 h-full max-w-4xl mx-auto py-4 w-full">
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.3; cursor: pointer; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>

      {/* MINI DASHBOARD (Gọn gàng ở trên cùng) */}
      <div className="flex justify-center w-full px-2"> {/* Container để căn giữa và giới hạn độ rộng */}
        <MagneticCard className="bg-white/10 border-white/20 backdrop-blur-2xl shadow-2xl group">
          <div className="flex items-center gap-8 px-8 py-4">
            {/* Chill Points */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-400/20 rounded-xl group-hover:scale-110 transition-transform">
                <Zap size={18} className="text-yellow-400 fill-yellow-400" />
              </div>
              <span className="text-2xl font-black text-white italic tracking-tighter">{chillPoints}</span>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-4 w-[180px]">
              <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate * 100}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.6)]"
                />
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest min-w-[35px]">
                {Math.round(completionRate * 100)}%
              </span>
            </div>
          </div>
        </MagneticCard>
      </div>

      {/* INPUT SECTION (Giao diện cũ + Add Date) */}
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-black tracking-tighter text-white uppercase px-2">Tasks</h2>
        <form onSubmit={addTask} className="flex gap-2 bg-white/5 p-2 rounded-[28px] border border-white/10 backdrop-blur-md">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Next win..."
            className="flex-1 bg-transparent px-6 py-3 text-white outline-none placeholder:text-white/20 font-bold"
          />

          <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 border border-white/5">
            <CalendarIcon size={14} className="text-white/20" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent text-white text-[10px] outline-none font-black uppercase tracking-tighter cursor-pointer"
            />
          </div>

          <button type="submit" className="bg-white text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg flex-shrink-0">
            <Plus size={24} strokeWidth={3} />
          </button>
        </form>
      </div>

      {/* TASK LIST (Giữ nguyên style 3D Tilt cũ) */}
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
                  whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.08)" }}
                  className="group flex items-center gap-4 p-5 rounded-[24px] border border-white/5 bg-white/5 transition-all"
                >
                  <button onClick={() => toggleTask(task.id)} className="active:scale-125 transition-transform">
                    {task.completed ?
                      <CheckCircle2 className="w-7 h-7 text-emerald-400 fill-emerald-400/10" /> :
                      <Circle className="w-7 h-7 text-white/10 group-hover:text-white/30" />
                    }
                  </button>

                  <div className="flex flex-col flex-1">
                    <span className={cn("font-bold text-lg text-white transition-all", task.completed && "line-through opacity-20 text-emerald-100")}>
                      {task.text}
                    </span>
                    {task.dueDate && (
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/50 mt-0.5">
                        {format(new Date(task.dueDate), 'dd MMM yyyy')}
                      </span>
                    )}
                  </div>

                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-white/10 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            /* QUOTE KHI TRỐNG (Card 3D Layer bạn thích) */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center opacity-50">
              <QuoteIcon className="w-8 h-8 mb-4 text-white/10" />
              <p className="text-xl font-medium italic text-center max-w-md px-6 leading-relaxed">"{quote?.quote}"</p>
              <span className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">— {quote?.author}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};