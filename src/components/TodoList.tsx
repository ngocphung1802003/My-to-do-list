import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Quote as QuoteIcon } from 'lucide-react';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

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
      tags: [],
      createdAt: Date.now(),
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    // Bắn confetti khi task chuyển từ chưa hoàn thành sang hoàn thành
    if (task && !task.completed) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7257fa', '#fbbf24', '#3b82f6', '#0a3cff'],
        zIndex: 999
      });
    }
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col gap-8 h-full max-w-4xl mx-auto py-4">
      <style>{`
        /* Khung chứa card */
        .quote-card-container { 
          position: relative; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          width: 100%; 
          max-width: 480px; 
          margin-top: 60px;
          perspective: 1000px;
        }
        
        /* THẺ CHÍNH MÀU XANH - NẰM TRÊN CÙNG */
        .quote-main-content { 
          display: flex; 
          flex-direction: column; 
          align-items: flex-start; 
          gap: 20px; 
          padding: 40px; 
          border-radius: 28px; 
          color: #ffffffff; 
          background: #0c0c0cfb !important; 
          position: relative; 
          z-index: 50; 
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        /* Lớp phụ 1 (Mờ 50%) */
        .layer-bg-1 {
          position: absolute;
          top: -15px;
          left: 50%;
          width: 90%;
          height: 100%;
          transform: translateX(-50%);
          background: #000000ff;
          z-index: 30; 
          opacity: 0.8;
          border-radius: 28px;
          transition: all 0.5s ease;
        }

        /* Lớp phụ 2 (Mờ 50%) */
        .layer-bg-2 {
          position: absolute;
          top: -30px;
          left: 50%;
          width: 80%;
          height: 100%;
          transform: translateX(-50%);
          background: #000000ff;
          z-index: 20; 
          opacity: 0.8;
          border-radius: 28px;
          transition: all 0.5s ease;
        }

        .quote-card-container:hover .quote-main-content { transform: translateY(-10px); }
        .quote-card-container:hover .layer-bg-1 { transform: translate(-50%, 5px) rotate(-8deg); opacity: 0.7; }
        .quote-card-container:hover .layer-bg-2 { transform: translate(-50%, 10px) rotate(8deg); opacity: 0.7; }
      `}</style>

      {/* Input Section */}
      <div className="flex flex-col gap-4 z-20">
        <h2 className="text-4xl font-black tracking-tighter text-white">TASKS</h2>
        <form onSubmit={addTask} className="flex gap-3 bg-white/10 p-2 rounded-[24px] border border-white/10 backdrop-blur-md shadow-2xl">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Việc cần làm tiếp theo..."
            className="flex-1 bg-transparent px-6 py-3 text-white outline-none placeholder:text-white/30 font"
          />
          <button type="submit" className="bg-white text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-50 transition-colors shadow-lg active:scale-95">
            <Plus className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* Task List hoặc Quote Card */}
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
                  <button onClick={() => toggleTask(task.id)} className="text-white/40 hover:text-white transition-transform active:scale-125">
                    {task.completed ? <CheckCircle2 className="w-7 h-7 text-emerald-400 fill-emerald-400/10" /> : <Circle className="w-7 h-7 hover:text-white" />}
                  </button>
                  <span className={cn("flex-1 font-bold text-lg text-white transition-all", task.completed && "line-through opacity-30 text-emerald-100")}>
                    {task.text}
                  </span>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-10 w-full"
            >
              <div className="quote-card-container">
                <div className="quote-main-content">
                  <QuoteIcon className="w-10 h-10 text-white/30 mb-2" />
                  <p className="font-bold text-xl italic leading-relaxed">"{quote?.quote || "Loading..."}"</p>
                  <span className="text-sm font-black uppercase tracking-widest text-orange-400 mt-4">— {quote?.author || "Aurora"}</span>
                </div>
                <div className="layer-bg-1"></div>
                <div className="layer-bg-2"></div>
              </div>
              <p className="text-white/20 font-black text-xs mt-12 tracking-[0.4em] uppercase">All caught up!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};