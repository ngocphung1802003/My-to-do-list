/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, FileText, Search, ArrowRight, Edit3, Save } from 'lucide-react';
import { Note } from '../types';
import { Button } from './Button';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

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
      title: 'New Idea',
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
      <style>{`
        /* STYLE CHO DANH SÁCH CARD (SIDEBAR) */
        .note-card {
          --border-radius: 0.75rem;
          --primary-color: #7257fa;
          --secondary-color: #3c3852;
          width: 100%;
          font-family: "Arial", sans-serif;
          padding: 1.2rem;
          cursor: pointer;
          border-radius: var(--border-radius);
          background: #f1f1f3; /* Màu trắng ngà của Card */
          box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 5%);
          position: relative;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          margin-bottom: 1rem;
        }

        .note-card.active {
          border-color: var(--primary-color);
          transform: translateY(-3px);
          box-shadow: 0px 12px 20px 0px rgb(114 87 250 / 15%);
        }

        .note-card .card__title {
          color: var(--secondary-color);
          font-size: 1.2rem;
          font-weight: bold;
          transition: 0.2s;
          display: block;
          margin-bottom: 0.5rem;
        }

        .note-card .card__content {
          color: #6e6b80;
          font-size: 0.85rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 1.2rem;
        }

        .note-card .card__date {
          color: #a09eb1;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .note-card .card__arrow {
          position: absolute;
          background: var(--primary-color);
          padding: 0.5rem;
          border-top-left-radius: var(--border-radius);
          border-bottom-right-radius: var(--border-radius);
          bottom: 0;
          right: 0;
          transition: 0.3s;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .note-card:hover .card__title {
          color: var(--primary-color);
          text-decoration: underline;
        }

        .note-card:hover .card__arrow {
          background: #111;
        }

        .note-card:hover .card__arrow svg {
          transform: translateX(3px);
        }

        /* HIỆU ỨNG GIẤY CHẤM (DOT GRID) CHO VÙNG SOẠN THẢO */
        .paper-container {
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          background-image: radial-gradient(rgba(12, 12, 12, 0.12) 1.5px, transparent 0);
          background-size: 30px 30px;
          background-position: -5px -5px;
        }

        .custom-scrollbar-light::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      {/* HEADER TỔNG */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Notes</h2>
          <p className="opacity-40 font-bold text-xs tracking-widest">CAPTURE YOUR THOUGHTS</p>
        </div>
        <button
          onClick={addNote}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold"
        >
          <Plus size={20} /> New Note
        </button>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* SIDEBAR DANH SÁCH CARD */}
        <div className="w-[400px] flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setIsEditing(false);
                  }}
                  className={cn("note-card group", selectedNoteId === note.id && "active")}
                >
                  <span className="card__title">{note.title || 'Untitled'}</span>
                  <p className="card__content">
                    {note.content || 'Click to write something...'}
                  </p>
                  <div className="card__date">
                    {format(note.updatedAt, 'MMMM dd, yyyy')}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="card__arrow">
                    <ArrowRight size={18} color="white" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* VÙNG SOẠN THẢO TRẮNG SOLID VỚI DOT GRID */}
        <div className="flex-1 bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden text-black border border-gray-100">
          {selectedNote ? (
            <div className="flex flex-col h-full">
              {/* Toolbar */}
              <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <input
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  className="bg-transparent text-3xl font-black outline-none w-full text-black placeholder:text-gray-200"
                  placeholder="Note Title"
                />
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
                    isEditing ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {isEditing ? <><Save size={18} /> Done</> : <><Edit3 size={18} /> Edit</>}
                </button>
              </div>

              {/* Content với Dot Grid */}
              <div className="flex-1 overflow-y-auto paper-container custom-scrollbar-light">
                <div className="p-14 min-h-full">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.textarea
                        key="editor"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        value={selectedNote.content}
                        onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                        className="w-full h-full bg-transparent resize-none focus:outline-none font-sans text-xl leading-[1.8] text-gray-800"
                        placeholder="Start writing your thoughts here..."
                        spellCheck={false}
                        autoFocus
                      />
                    ) : (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="prose prose-lg prose-blue max-w-none text-gray-800 font-medium leading-[1.8]"
                      >
                        <ReactMarkdown>{selectedNote.content || "_No content. Click Edit to start writing._"}</ReactMarkdown>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-100 bg-gray-50/30">
              <FileText size={120} strokeWidth={0.5} className="opacity-20 mb-6" />
              <p className="font-black tracking-[0.3em] uppercase text-gray-300">Select a note to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};