/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Folder, Search, ArrowRight, Edit3, Save } from 'lucide-react';
import { Note } from '../types';
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
      setSelectedNoteId(null);
    }
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-full text-white">
      <style>{`
        /* STYLE CARD GEORGE FRANCIS VẪN GIỮ NGUYÊN */
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
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 2px solid transparent;
          margin-bottom: 0.8rem;
        }
        .note-card.active {
          border-color: var(--primary-color);
          transform: translateX(10px);
          box-shadow: -10px 10px 20px rgba(0,0,0,0.1);
        }
        .note-card .card__title { color: var(--secondary-color); font-size: 1.1rem; font-weight: 800; }
        .note-card .card__content { color: #6e6b80; font-size: 0.85rem; margin-top: 0.4rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .note-card .card__arrow { position: absolute; background: var(--primary-color); padding: 0.5rem; border-top-left-radius: var(--border-radius); border-bottom-right-radius: var(--border-radius); bottom: 0; right: 0; transition: 0.3s; display: flex; justify-content: center; align-items: center; }
        .note-card:hover .card__arrow { background: #111; }
        
        .paper-dot-grid {
          background-color: #ffffff;
          background-image: radial-gradient(rgba(12, 12, 12, 0.12) 1.5px, transparent 0);
          background-size: 30px 30px;
          background-position: -5px -5px;
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <Folder className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-black uppercase tracking-tighter">My Vault</h2>
        </div>
        <button onClick={addNote} className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
          <Plus size={20} /> New Note
        </button>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[380px] flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {filteredNotes.map((note) => (
              <div key={note.id} onClick={() => { setSelectedNoteId(note.id); setIsEditing(false); }} className={cn("note-card group", selectedNoteId === note.id && "active")}>
                <div className="card__title">{note.title || 'Untitled'}</div>
                <div className="card__content">{note.content || '...'}</div>
                <div className="text-[10px] font-bold text-gray-400 mt-2 uppercase">{format(note.updatedAt, 'MMM dd, yyyy')}</div>
                <div className="card__arrow"><ArrowRight size={18} color="white" /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden text-black border border-gray-100 relative">
          {selectedNote ? (
            <div className="flex flex-col h-full animate-in fade-in duration-500">
              <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <input value={selectedNote.title} onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })} className="bg-transparent text-3xl font-black outline-none w-full text-black" />
                <button onClick={() => setIsEditing(!isEditing)} className={cn("px-6 py-2.5 rounded-xl font-bold transition-all", isEditing ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white")}>
                  {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto paper-dot-grid p-14">
                {isEditing ? (
                  <textarea value={selectedNote.content} onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })} className="w-full h-full bg-transparent resize-none outline-none text-xl leading-[1.8] text-gray-800" spellCheck={false} autoFocus />
                ) : (
                  <div className="prose prose-lg max-w-none text-gray-800 font-medium leading-[1.8]"><ReactMarkdown>{selectedNote.content || "_Start writing..._"}</ReactMarkdown></div>
                )}
              </div>
            </div>
          ) : (
            /* EMPTY STATE VỚI FOLDER 3D ANIMATION */
            <section className="relative group flex flex-col items-center justify-center w-full h-full bg-gray-50/30">
              <div className="file relative w-60 h-40 cursor-pointer origin-bottom [perspective:1500px] z-50">
                <div className="work-5 bg-amber-600 w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-amber-600 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]"></div>
                <div className="work-4 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]"></div>
                <div className="work-3 absolute inset-1 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]"></div>
                <div className="work-2 absolute inset-1 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]"></div>
                <div className="work-1 absolute bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[156px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[146px] after:h-[16px] after:bg-amber-400 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:right-[142px] before:size-3 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)]"></div>
              </div>
              <p className="text-xl font-black pt-8 opacity-20 uppercase tracking-[0.5em] text-black">Hover to Open Vault</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};