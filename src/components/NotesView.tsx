import React, { useState } from 'react';
import { Plus, Trash2, FileText, Search, Edit3 } from 'lucide-react';
import { Note } from '../types';
import { Button } from './Button';
import { Card } from './Card';
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
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(notes.find(n => n.id !== id)?.id || null);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Notes</h2>
          <p className="text-white/50">Capture thoughts in the flow.</p>
        </div>
        <Button onClick={addNote} className="rounded-2xl">
          <Plus className="w-5 h-5 mr-2" />
          New Note
        </Button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-80 flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-white placeholder:text-white/40 shadow-lg"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setIsEditing(false);
                }}
                className={cn(
                  'w-full text-left p-5 rounded-[24px] transition-all group relative overflow-hidden border',
                  selectedNoteId === note.id 
                    ? 'bg-white/20 border-white/40 shadow-xl scale-[1.02]' 
                    : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                )}
              >
                <h4 className="font-bold text-lg truncate mb-1.5">{note.title}</h4>
                <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">{note.content || 'No content yet...'}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                  {selectedNoteId === note.id && (
                    <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,209,45,0.8)]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor/Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedNote ? (
              <motion.div
                key={selectedNote.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <Card className="flex-1 flex flex-col p-0 overflow-hidden bg-white/5 border-white/10">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={selectedNote.title}
                        onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                        className="bg-transparent text-2xl font-bold focus:outline-none w-full"
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-2xl font-bold">{selectedNote.title}</h3>
                    )}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditing(!isEditing)}
                          className="rounded-xl"
                        >
                          {isEditing ? 'View' : <Edit3 className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => deleteNote(selectedNote.id)}
                          className="rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {isEditing && (
                        <input
                          type="date"
                          value={selectedNote.dueDate || ''}
                          onChange={(e) => updateNote(selectedNote.id, { dueDate: e.target.value || undefined })}
                          className="bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-[10px] focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8">
                    {isEditing ? (
                      <textarea
                        value={selectedNote.content}
                        onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                        placeholder="Start writing in markdown..."
                        className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed text-white/80"
                      />
                    ) : (
                      <div className="prose prose-invert max-w-none prose-p:text-white/70 prose-headings:text-white prose-strong:text-white prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1 prose-code:rounded">
                        <ReactMarkdown>
                          {selectedNote.content || '*No content yet. Click edit to start writing.*'}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>Select a note or create a new one.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
