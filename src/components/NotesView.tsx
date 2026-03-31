/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Folder, Search, ArrowRight, Edit3, Save, FileText } from 'lucide-react';
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
        /* STYLE CHO DANH SÁCH CARD */
        .note-card {
          --border-radius: 0.75rem;
          --primary-color: #7257fa;
          --secondary-color: #3c3852;
          width: 100%;
          padding: 1.2rem;
          cursor: pointer;
          border-radius: var(--border-radius);
          background: #f1f1f3;
          box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 5%);
          position: relative;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Animation đàn hồi */
          border: 2px solid transparent;
          margin-bottom: 1rem;
        }

        /* Hiệu ứng Folder mở rộng khi Active */
        .note-card.active {
          border-color: var(--primary-color);
          transform: scale(1.02) translateX(10px);
          box-shadow: -10px 10px 25px rgba(114, 87, 250, 0.2);
        }

        .note-card .card__title {
          color: var(--secondary-color);
          font-size: 1.1rem;
          font-weight: 800;
          transition: 0.2s;
        }

        .note-card .card__content {
          color: #6e6b80;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          margin-bottom: 1.2rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

        .note-card:hover .card__arrow { background: #111; }
        .note-card:hover .card__arrow svg { transform: translateX(3px); }

        /* DOT GRID BACKGROUND */
        .paper-container {
          background-color: #ffffff;
          background-image: radial-gradient(rgba(12, 12, 12, 0.12) 1.5px, transparent 0);
          background-size: 30px 30px;
          background-position: -5px -5px;
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Folder className="w-8 h-8 text-yellow-400 fill-yellow-400/20" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">My Vault</h2>
            <p className="opacity-40 text-[10px] font-bold tracking-[0.3em]">STORAGE / NOTES</p>
          </div>
        </div>
        <button
          onClick={addNote}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold"
        >
          <Plus size={20} /> Add Note
        </button>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Sidebar Card List */}
        <div className="w-[380px] flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 outline-none"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setIsEditing(false);
                  }}
                  className={cn("note-card group", selectedNoteId === note.id && "active")}
                >
                  <span className="card__title">{note.title || 'Untitled'}</span>
                  <p className="card__content">{note.content || '...'}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-bold text-[#a09eb1] uppercase">
                      {format(note.updatedAt, 'dd MMM')}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all mr-10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="card__arrow">
                    <ArrowRight size={18} color="white" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden text-black border border-gray-100">
          <AnimatePresence mode="wait">
            {selectedNote ? (
              <motion.div
                key={selectedNote.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <input
                    value={selectedNote.title}
                    onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                    className="bg-transparent text-3xl font-black outline-none w-full text-black placeholder:text-gray-200"
                  />
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
                      isEditing ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {isEditing ? <><Save size={18} /> Save</> : <><Edit3 size={18} /> Edit</>}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto paper-container custom-scrollbar-light p-14">
                  {isEditing ? (
                    <textarea
                      value={selectedNote.content}
                      onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                      className="w-full h-full bg-transparent resize-none outline-none text-xl leading-[1.8] text-gray-800"
                      spellCheck={false}
                      autoFocus
                    />
                  ) : (
                    <div className="prose prose-lg max-w-none text-gray-800 font-medium leading-[1.8]">
                      <ReactMarkdown>{selectedNote.content || "_No content yet._"}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-200">
                <FileText size={100} strokeWidth={0.5} className="opacity-10 mb-4" />
                <p className="font-black tracking-[0.3em] uppercase">Select File</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};