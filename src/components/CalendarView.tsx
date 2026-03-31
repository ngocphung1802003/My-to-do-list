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
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { Task, Note } from '../types';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { MagneticCard } from './MagneticCard';
// Lưu ý: Nếu file MagneticCard nằm cùng thư mục với CalendarView thì dùng './MagneticCard'
// Nếu khác thư mục (ví dụ Calendar ở folder khác) thì dùng '../components/MagneticCard'

interface CalendarViewProps {
  tasks: Task[];
  notes: Note[];
}

export const CalendarView = ({ tasks, notes }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Hàm bổ trợ để kiểm tra ngày của Task (Ưu tiên dueDate, sau đó đến createdAt)
  const isTaskOnDay = (task: Task, day: Date) => {
    if (task.dueDate) {
      // Vì dueDate lưu dạng string "YYYY-MM-DD", cần parse cẩn thận
      return isSameDay(parseISO(task.dueDate), day);
    }
    return isSameDay(new Date(task.createdAt), day);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-8 px-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white uppercase italic">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <p className="text-white/50 font-medium tracking-wide">Your schedule at a glance.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" className="hover:bg-white/10 text-white" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="ghost" className="hover:bg-white/10 text-white" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
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
            border: 1px solid rgb(255, 255, 255) !important;
            background-color: rgba(255, 255, 255, 1) !important;
            color: #ffffffff !important;
          }
          .custom-scrollbar-light::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar-light::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        `}</style>

        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20 py-2">
            {d}
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);

          // Kiểm tra xem có task hoặc note nào trong ngày này không
          const hasTask = tasks.some(t => isTaskOnDay(t, day));
          const hasNote = notes.some(n => isSameDay(new Date(n.updatedAt), day));

          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "relative h-28 rounded-[24px] border transition-all duration-300 flex flex-col items-start p-4 gap-1 group",
                !isCurrentMonth ? "opacity-10 border-transparent pointer-events-none" : "border-white/5 bg-white/5 hover:bg-white/10",
                isSelected && "neon-day-active"
              )}
            >
              <span className={cn("text-xl font-black", isSelected ? "text-gray-900" : "text-white opacity-40 group-hover:opacity-100")}>
                {format(day, 'd')}
              </span>

              <div className="flex gap-1.5 mt-auto">
                {hasTask && (
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isSelected ? "bg-white" : "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"
                  )} />
                )}
                {hasNote && (
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isSelected ? "bg-white/60" : "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                  )} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderDetails = () => {
    const dayTasks = tasks.filter(t => isTaskOnDay(t, selectedDate));
    const dayNotes = notes.filter(n => isSameDay(new Date(n.updatedAt), selectedDate));

    return (
      /* Bọc MagneticCard với các thuộc tính của Card cũ */
      <MagneticCard
        className="w-[420px] bg-white text-black shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500 overflow-hidden"
      >
        {/* Nội dung bên trong bọc trong padding p-10 để giữ nguyên design */}
        <div className="flex flex-col h-full p-10">

          {/* Header Ngày tháng */}
          <div className="border-b border-gray-100 pb-8 mb-8">
            <h3 className="text-4xl font-black tracking-tighter text-black uppercase">
              {format(selectedDate, 'eeee')}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <CalendarIcon size={14} className="text-blue-600" />
              <p className="text-blue-600 font-black uppercase text-[10px] tracking-[0.2em]">
                {format(selectedDate, 'MMMM do, yyyy')}
              </p>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar-light space-y-10">
            {/* Tasks Section */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                Tasks ({dayTasks.length})
              </h4>
              <div className="space-y-3">
                {dayTasks.length === 0 ? (
                  <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-200 text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Free Day</p>
                  </div>
                ) : (
                  dayTasks.map(task => (
                    <div key={task.id} className={cn(
                      "p-5 rounded-3xl border text-sm font-bold shadow-sm flex items-center gap-4 transition-all",
                      task.completed ? "bg-emerald-50/50 border-emerald-100 text-emerald-700 opacity-60" : "bg-gray-50 border-gray-100 text-gray-800"
                    )}>
                      <div className={cn(
                        "w-3 h-3 rounded-full shrink-0",
                        task.completed ? "bg-emerald-400" : (task.priority === 'high' ? "bg-red-500" : "bg-blue-500")
                      )} />
                      <span className={cn(task.completed && "line-through")}>{task.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 mb-5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Notes ({dayNotes.length})
              </h4>
              <div className="space-y-3">
                {dayNotes.length === 0 ? (
                  <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-200 text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No Notes</p>
                  </div>
                ) : (
                  dayNotes.map(note => (
                    <div key={note.id} className="p-5 rounded-3xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-800 shadow-sm hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer group flex items-center justify-between">
                      <span>{note.title}</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </MagneticCard>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-white">
      {renderHeader()}
      <div className="flex-1 flex gap-8 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-10">
          {renderDays()}
        </div>
        {renderDetails()}
      </div>
    </div>
  );
};