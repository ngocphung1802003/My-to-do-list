/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Folder, Search, ArrowRight, Edit3, Save, X, MousePointer2 } from 'lucide-react';
import { Note } from '../types';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export const NotesView = ({ notes, setNotes }: { notes: Note[], setNotes: any }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const addNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitle',
      content: '',
      tags: [],
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setIsEditing(true);
  };

  const deleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-full text-white">
      <style>{`
        .folder-3d-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.01);
        }

        .file-folder {
          position: relative;
          width: 280px;
          height: 190px;
          cursor: pointer;
          perspective: 1200px;
          transition: transform 0.2s active;
        }
        
        .file-folder:active { transform: scale(0.95); }

        .f-back {
          position: absolute; inset: 0;
          background: #d97706; border-radius: 18px;
          border-top-left-radius: 0;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }

        .f-back::before {
          content: ""; position: absolute; bottom: 100%; left: 0;
          width: 100px; height: 20px; background: #d97706;
          border-radius: 14px 14px 0 0;
        }

        .f-page {
          position: absolute; inset: 12px;
          background: #ffffff; border-radius: 12px;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-origin: bottom;
          display: flex; align-items: center; justify-content: center;
        }
        .f-page-1 { background: #cbd5e1; z-index: 2; }
        .f-page-2 { background: #f8fafc; z-index: 3; }

        .f-front {
          position: absolute; bottom: 0; width: 100%; height: 184px;
          background: linear-gradient(to top, #f59e0b, #fbbf24);
          border-radius: 18px; border-top-right-radius: 0;
          z-index: 5; transform-origin: bottom;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .f-front::after {
          content: ""; position: absolute; bottom: 100%; right: 0;
          width: 160px; height: 20px; background: #fbbf24;
          border-radius: 14px 14px 0 0;
        }

        /* Hover states */
        .file-folder:hover .f-page-1 { transform: rotateX(-30deg) translateY(-15px); }
        .file-folder:hover .f-page-2 { transform: rotateX(-45deg) translateY(-25px); }
        .file-folder:hover .f-front { 
          transform: rotateX(-55deg); 
          box-shadow: inset 0 25px 50px rgba(217, 119, 6, 0.4);
        }

        .note-card-ui {
          background: #f1f1f3; border-radius: 18px; padding: 1.5rem;
          position: relative; transition: 0.3s; cursor: pointer;
          border: 2px solid transparent; box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .note-card-ui.active { border-color: #151515ff; transform: translateX(12px); }
        .paper-grid {
          background-color: #ffffff;
          background-image: radial-gradient(rgba(0,0,0,0.1) 1.5px, transparent 0);
          background-size: 20px 20px;
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-2">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setSelectedNoteId(null)}>
          <Folder className="text-yellow-400 w-8 h-8 fill-yellow-400/10 group-hover:scale-110 transition-transform" />
          <h2 className="text-3xl font-black uppercase tracking-tighter ">Vault</h2>
        </div>
        <button onClick={addNote} className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-2xl font-bold border border-white/10 transition-all flex items-center gap-2 active:scale-95">
          <Plus size={18} strokeWidth={2} /> New Note
        </button>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden px-4 pb-4">
        {/* Sidebar */}
        <div className="w-[380px] flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:bg-white/10"
              placeholder="Search in vault..."
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id} layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => { setSelectedNoteId(note.id); setIsEditing(false); }}
                  className={cn("note-card-ui group", selectedNoteId === note.id && "active")}
                >
                  <button onClick={(e) => deleteNote(e, note.id)} className="absolute top-4 right-4 p-2 rounded-xl bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-20">
                    <Trash2 size={14} />
                  </button>
                  <span className="text-[#3c3852] font-black text-lg block mb-2 group-hover:text-[#7257fa] group-hover:underline">{note.title || 'Untitled'}</span>
                  <p className="text-[#6e6b80] text-xs line-clamp-2 leading-relaxed mb-4">{note.content || 'Empty note...'}</p>
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {format(note.updatedAt, 'MMM dd, yyyy')}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-[#7257fa] p-2 rounded-tl-xl rounded-br-xl">
                    <ArrowRight size={18} color="white" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden text-black border border-gray-100 relative">
          {selectedNote ? (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <input
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  className="bg-transparent text-3xl font-black outline-none w-full text-black placeholder:text-gray-200"
                />
                <button onClick={() => setIsEditing(!isEditing)} className={cn("px-8 py-3 rounded-2xl font-black transition-all shadow-lg active:scale-95", isEditing ? "bg-emerald-500 text-white" : "bg-[#7257fa] text-white")}>
                  {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto paper-grid p-16 custom-scrollbar-light">
                {isEditing ? (
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                    className="w-full h-full bg-transparent resize-none outline-none text-xl leading-[1.8] text-gray-800 font-medium"
                    spellCheck={false} autoFocus
                  />
                ) : (
                  <div className="prose prose-lg max-w-none text-gray-800 font leading-[1]">
                    <ReactMarkdown>{selectedNote.content || "..."}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CLICK VÀO ĐÂY ĐỂ TẠO NOTE MỚI */
            <div className="folder-3d-wrapper">
              <div
                className="file-folder group"
                onClick={addNote}
                title="Click to create a new note"
              >
                <div className="f-back"></div>
                <div className="f-page f-page-1"></div>
                <div className="f-page f-page-2"></div>
                <div className="f-page f-page-3"></div>
                <div className="f-page f-page-4"></div>
                <div className="f-page f-page-5">
                  <Plus className="text-indigo-400 opacity-20" size={40} />
                </div>
                <div className="f-front"></div>
              </div>
              <div className="mt-5 flex flex-col items-center gap-1">
                <p className="text-xl font-black opacity-30 lowercase text-black italic">Add Your Note</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};