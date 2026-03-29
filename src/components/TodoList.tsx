import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '../types';
import { Button } from './Button';
import { Card } from './Card';
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
    setDueDate('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const priorityColors = {
    low: 'text-emerald-400 bg-emerald-400/10',
    medium: 'text-amber-400 bg-amber-400/10',
    high: 'text-rose-400 bg-rose-400/10',
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Tasks</h2>
          <p className="text-white/50">Organize your day with clarity.</p>
        </div>
      </div>

      <Card className="p-6 border-white/20 shadow-xl">
        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-white/40 text-white"
          />
          <div className="flex flex-wrap gap-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
            >
              <option value="low" className="bg-[#1E88E5]">Low</option>
              <option value="medium" className="bg-[#1E88E5]">Medium</option>
              <option value="high" className="bg-[#1E88E5]">High</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
            />
            <Button type="submit" className="rounded-2xl px-6 py-4 bg-white text-[#1E88E5] hover:bg-white/90 font-bold shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </div>
        </form>
      </Card>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-white/20"
            >
              <CheckCircle2 className="w-16 h-16 mb-4 opacity-20" />
              <p>All caught up! Time for a break.</p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  'glass-card rounded-2xl p-4 flex items-center gap-4 group',
                  task.completed && 'opacity-50'
                )}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className="text-white/30 hover:text-purple-400 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                
                <div className="flex-1">
                  <p className={cn(
                    'font-bold text-lg transition-all',
                    task.completed && 'line-through text-white/40'
                  )}>
                    {task.text}
                  </p>
                  <div className="flex gap-3 mt-2 items-center">
                    <span className={cn(
                      'text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full shadow-sm',
                      priorityColors[task.priority]
                    )}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-[10px] text-white/60 flex items-center gap-1.5 font-medium">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
