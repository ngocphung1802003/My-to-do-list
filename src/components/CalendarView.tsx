import React, { useState } from 'react';
import {
  format,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, FileText } from 'lucide-react';
import { Task, Note } from '../types';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '../lib/utils';

interface CalendarViewProps {
  tasks: Task[];
  notes: Note[];
}

export const CalendarView = ({ tasks, notes }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-8 px-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <p className="text-white/50">Your schedule at a glance.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-2">
        <style>{`
          .neon-day-active {
            box-shadow: 0px 0px 5px rgb(151, 243, 255) inset,
                        0px 0px 10px rgb(151, 243, 255) inset, 
                        0px 0px 25px rgb(151, 243, 255), 
                        0px 0px 5px rgb(151, 243, 255);
            border: 2px solid rgb(255, 255, 255) !important;
            background-color: rgba(146, 180, 184, 0.07) !important;
            color: #1a202c !important;
          }
          .custom-scrollbar-light::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar-light::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        `}</style>

        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-white/30 py-2">
            {d}
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "relative h-24 rounded-2xl border transition-all duration-300 flex flex-col items-start p-4 gap-1",
                !isCurrentMonth ? "opacity-20 border-transparent" : "border-white/5 bg-white/5 hover:bg-white/10",
                isSelected && "neon-day-active"
              )}
            >
              <span className={cn("text-lg font-bold", isSelected ? "text-gray-900" : "text-white")}>
                {format(day, 'd')}
              </span>
              <div className="flex gap-1 mt-auto">
                {tasks.some(t => isSameDay(new Date(t.createdAt), day)) && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />}
                {notes.some(n => isSameDay(new Date(n.updatedAt), day)) && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderDetails = () => {
    const dayTasks = tasks.filter(t => isSameDay(new Date(t.createdAt), selectedDate));
    const dayNotes = notes.filter(n => isSameDay(new Date(n.updatedAt), selectedDate));

    return (
      <Card className="w-96 bg-white border-none shadow-2xl flex flex-col gap-8 h-full text-black">
        <div className="border-b border-gray-100 pb-6">
          <h3 className="text-3xl font-black tracking-tighter text-black">
            {format(selectedDate, 'eeee')}
          </h3>
          <p className="text-blue-600 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
            {format(selectedDate, 'MMMM do, yyyy')}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar-light space-y-8">
          {/* Tasks Section */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              Tasks ({dayTasks.length})
            </h4>
            <div className="space-y-3">
              {dayTasks.length === 0 ? (
                <p className="text-xs text-gray-300 italic font-medium">No tasks for this day.</p>
              ) : (
                dayTasks.map(task => (
                  <div key={task.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-800 shadow-sm flex items-center gap-3 transition-hover hover:border-blue-200">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      task.priority === 'high' ? "bg-red-500" : "bg-blue-400"
                    )} />
                    {task.text}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              Notes ({dayNotes.length})
            </h4>
            <div className="space-y-3">
              {dayNotes.length === 0 ? (
                <p className="text-xs text-gray-300 italic font-medium">No notes created.</p>
              ) : (
                dayNotes.map(note => (
                  <div key={note.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-800 shadow-sm hover:border-amber-200 transition-colors cursor-pointer">
                    {note.title}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-white">
      {renderHeader()}
      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {renderDays()}
        </div>
        {renderDetails()}
      </div>
    </div>
  );
};