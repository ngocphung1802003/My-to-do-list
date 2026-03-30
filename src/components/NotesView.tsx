import React, { useState } from 'react';
import { Plus, Trash2, FileText, Search } from 'lucide-react';
import { Note } from '../types';
import { Button } from './Button';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface NotesViewProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const NotesView = ({ notes, setNotes }: NotesViewProps) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const addNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setIsEditing(true);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const deleteNote = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (selectedNoteId === id) {
      setSelectedNoteId(newNotes[0]?.id || null);
    }
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-full text-white">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Notes</h2>
          <p className="opacity-60">Capture thoughts in the flow.</p>
        </div>
        {/* Nút nhỏ dự phòng ở Header */}
        <Button onClick={addNote} className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl">
          <Plus className="w-5 h-5 mr-2" /> New Note
        </Button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar bên trái (Aurora Style) */}
        <div className="w-80 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              className="w-full bg-white/10 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setIsEditing(false);
                }}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all group relative",
                  selectedNoteId === note.id
                    ? "bg-white/20 border-white/30 shadow-lg"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                )}
              >
                <h4 className="font-bold truncate pr-6">{note.title || 'Untitled'}</h4>
                <p className="text-xs opacity-40 line-clamp-1 mt-1">{note.content || 'No content...'}</p>
                <Trash2
                  className="absolute right-4 top-4 w-4 h-4 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Editor bên phải (White Paper Canvas) */}
        <div className="flex-1 bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-black border border-gray-100 relative">
          {selectedNote ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col h-full"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <input
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  className="bg-transparent text-2xl font-bold outline-none w-full text-black"
                />
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-white">
                {isEditing ? (
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                    className="w-full h-full bg-transparent resize-none focus:outline-none font-sans text-lg leading-relaxed text-gray-800"
                    placeholder="Start typing..."
                  />
                ) : (
                  <div className="prose prose-blue max-w-none text-gray-800">
                    <ReactMarkdown>{selectedNote.content || "_No content yet._"}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* TRẠNG THÁI TRỐNG VỚI FOLDER ANIMATION NHƯ BẠN YÊU CẦU */
            <div className="flex-1 flex flex-col items-center justify-center p-12">
              <section
                onClick={addNote}
                className="relative group flex flex-col items-center justify-center w-full cursor-pointer transition-transform hover:scale-105"
              >
                <div className="file relative w-60 h-40 origin-bottom [perspective:1500px] z-50">
                  <div className="work-5 bg-amber-600 w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-amber-600 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]"></div>
                  <div className="work-4 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]"></div>
                  <div className="work-3 absolute inset-1 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]"></div>
                  <div className="work-2 absolute inset-1 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]"></div>
                  <div className="work-1 absolute bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[156px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[146px] after:h-[16px] after:bg-amber-400 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:right-[142px] before:size-3 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)]"></div>
                </div>
                <p className="text-xl font-bold mt-8 text-gray-400 group-hover:text-amber-600 transition-colors">
                  Create New Note
                </p>
                <p className="text-sm text-gray-300 mt-2">Click the folder to start capturing ideas</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};