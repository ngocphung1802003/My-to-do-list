import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar as CalendarIcon, Quote as QuoteIcon } from 'lucide-react';
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
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);

  // Fetch Quote khi không còn task nào
  useEffect(() => {
    if (tasks.length === 0) {
      const fetchQuote = async () => {
        try {
          const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
            headers: { 'X-Api-Key': '7rk4MKnNmwhwFUEsYxvJdVDwy1pqIoSvzDgzFAO9' }, // THAY API KEY CỦA BẠN VÀO ĐÂY
          });
          const data = await response.json();
          if (data && data.length > 0) {
            setQuote(data[0]);
          }
        } catch (error) {
          console.error("Error fetching quote:", error);
          setQuote({ quote: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney" });
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
      priority,
      tags: [],
      createdAt: Date.now(),
      dueDate: dueDate || undefined,
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
        .quote-card { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; max-width: 450px; border-radius: 24px; line-height: 1.6; transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1); margin-top: 40px; }
        .quote-content { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; padding: 36px; border-radius: 22px; color: #ffffff; overflow: visible; background: #0a3cff; transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1); z-index: 1; position: relative; width: 100%; }
        .quote-content::before { position: absolute; content: ""; top: -4%; left: 50%; width: 90%; height: 90%; transform: translate(-50%); background: #ced8ff; z-index: -1; transform-origin: bottom; border-radius: inherit; transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1); }
        .quote-content::after { position: absolute; content: ""; top: -8%; left: 50%; width: 80%; height: 80%; transform: translate(-50%); background: #e7ecff; z-index: -2; transform-origin: bottom; border-radius: inherit; transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1); }
        .quote-card:hover { transform: translate(0px, -16px); }
        .quote-card:hover .quote-content::before { rotate: -8deg; top: 0; width: 100%; height: 100%; }
        .quote-card:hover .quote-content::after { rotate: 8deg; top: 0; width: 100%; height: 100%; }
      `}</style>

      {/* Input Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-black tracking-tighter text-white">TASKS</h2>
        <form onSubmit={addTask} className="flex gap-3 bg-white/10 p-2 rounded-[24px] border border-white/10 backdrop-blur-md">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-transparent px-6 py-3 text-white outline-none placeholder:text-white/30 font-medium"
          />
          <Button type="submit" className="bg-white text-blue-600 hover:bg-blue-50">
            <Plus className="w-5 h-5" />
          </Button>
        </form>
      </div>

      {/* Task List or Quote Card */}
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 p-5 rounded-[24px] border border-white/5 mb-3 transition-all"
              >
                <button onClick={() => toggleTask(task.id)} className="text-white/40 hover:text-white transition-colors">
                  {task.completed ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Circle className="w-6 h-6" />}
                </button>
                <span className={cn("flex-1 font-bold text-lg", task.completed && "line-through text-white/30")}>
                  {task.text}
                </span>
                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          ) : (
            /* HIỂN THỊ QUOTE KHI HẾT TASK */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <div className="quote-card">
                <div className="quote-content">
                  <QuoteIcon className="w-12 h-12 text-white/50" />
                  <p className="para font-bold text-xl italic leading-relaxed">
                    "{quote?.quote || "Loading your daily inspiration..."}"
                  </p>
                  <span className="link font-black uppercase tracking-widest">
                    — {quote?.author || "Aurora AI"}
                  </span>
                </div>
              </div>
              <p className="text-white/20 font-black text-sm mt-12 tracking-[0.3em] uppercase">All tasks completed</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};