import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  eachDayOfInterval,
  isToday,
  startOfDay
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

  const renderHeader = () => {
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
            background-color: rgb(146, 180, 184) !important;
            color: #1a202c !important;
          }
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
                  "relative h-20 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1",
                  !isCurrentMonth ? "opacity-20 border-transparent" : "border-white/5 bg-white/5 hover:bg-white/10",
                  isSelected && "neon-day-active" // Áp dụng hiệu ứng sáng từ Uiverse
                )}
              >
                <span className={cn("text-lg font-bold", isSelected ? "text-gray-900" : "text-white")}>
                  {format(day, 'd')}
                </span>
                {/* Chấm đánh dấu nếu có task/note */}
                <div className="flex gap-1">
                  {tasks.some(t => isSameDay(new Date(t.createdAt), day)) && <div className="w-1 h-1 rounded-full bg-blue-400" />}
                  {notes.some(n => isSameDay(new Date(n.updatedAt), day)) && <div className="w-1 h-1 rounded-full bg-yellow-400" />}
                </div>
              </button>
            );
          })}
        </div>
      );
    };

    return (
      <div className="flex flex-col h-full overflow-hidden text-white">
        {renderHeader()}
        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {renderDays()}
          </div>
          {/* Phần chi tiết bên phải (Card detail) giữ nguyên... */}
        </div>
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    const rows = [];
    let days = [];

    calendarDays.forEach((day, i) => {
      const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
      const dayNotes = notes.filter(n => n.dueDate && isSameDay(new Date(n.dueDate), day));
      const hasEvents = dayTasks.length > 0 || dayNotes.length > 0;

      days.push(
        <div
          key={day.toString()}
          className={cn(
            'relative h-32 glass-card border-white/10 p-3 transition-all cursor-pointer group rounded-2xl',
            !isSameMonth(day, monthStart) && 'opacity-20 grayscale',
            isSameDay(day, selectedDate) && 'bg-white/20 border-white/40 shadow-xl scale-[1.02] z-10',
            isToday(day) && 'ring-2 ring-yellow-400/50'
          )}
          onClick={() => setSelectedDate(day)}
        >
          <div className="flex justify-between items-start">
            <span className={cn(
              'text-sm font-black tracking-tight',
              isToday(day) ? 'text-yellow-400' : 'text-white/70'
            )}>
              {format(day, 'd')}
            </span>
            {hasEvents && (
              <div className="flex gap-1.5">
                {dayTasks.length > 0 && <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />}
                {dayNotes.length > 0 && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />}
              </div>
            )}
          </div>

          <div className="mt-3 space-y-1.5 overflow-hidden">
            {dayTasks.slice(0, 2).map(task => (
              <div key={task.id} className="text-[10px] truncate bg-white/10 text-white px-2 py-1 rounded-lg flex items-center gap-1.5 font-bold border border-white/5">
                <CheckCircle2 className="w-2.5 h-2.5 text-blue-400" />
                {task.text}
              </div>
            ))}
            {dayNotes.slice(0, 1).map(note => (
              <div key={note.id} className="text-[10px] truncate bg-white/10 text-white px-2 py-1 rounded-lg flex items-center gap-1.5 font-bold border border-white/5">
                <FileText className="w-2.5 h-2.5 text-yellow-400" />
                {note.title}
              </div>
            ))}
            {(dayTasks.length + dayNotes.length) > 3 && (
              <div className="text-[9px] text-white/40 pl-1 font-black">
                +{(dayTasks.length + dayNotes.length) - 3} MORE
              </div>
            )}
          </div>
        </div>
      );

      if ((i + 1) % 7 === 0) {
        rows.push(
          <div className="grid grid-cols-7 gap-1" key={day.toString()}>
            {days}
          </div>
        );
        days = [];
      }
    });

    return <div className="flex flex-col gap-1">{rows}</div>;
  };

  const renderSelectedDayDetails = () => {
    const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate));
    const dayNotes = notes.filter(n => n.dueDate && isSameDay(new Date(n.dueDate), selectedDate));

    return (
      <Card className="w-80 h-full flex flex-col border-white/20 shadow-2xl">
        <div className="mb-8">
          <h3 className="text-2xl font-black tracking-tight text-white">{format(selectedDate, 'EEEE')}</h3>
          <p className="text-sm text-white/50 font-bold tracking-wide uppercase">{format(selectedDate, 'MMMM do, yyyy')}</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Tasks ({dayTasks.length})
            </h4>
            <div className="space-y-3">
              {dayTasks.length === 0 ? (
                <p className="text-xs text-white/20 italic font-medium">No tasks for this day.</p>
              ) : (
                dayTasks.map(task => (
                  <div key={task.id} className="p-4 rounded-2xl bg-white/10 border border-white/10 text-sm font-bold shadow-sm">
                    {task.text}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-yellow-400" />
              Notes ({dayNotes.length})
            </h4>
            <div className="space-y-3">
              {dayNotes.length === 0 ? (
                <p className="text-xs text-white/20 italic font-medium">No notes linked to this day.</p>
              ) : (
                dayNotes.map(note => (
                  <div key={note.id} className="p-4 rounded-2xl bg-white/10 border border-white/10 text-sm font-bold shadow-sm">
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
    <div className="flex flex-col h-full overflow-hidden">
      {renderHeader()}
      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto pr-2">
          {renderDays()}
          {renderCells()}
        </div>
        {renderSelectedDayDetails()}
      </div>
    </div>
  );
};
