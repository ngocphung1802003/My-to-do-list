export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: number;
  dueDate?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: number;
  dueDate?: string;
}

export interface MindMapNode {
  id: string;
  type?: string;
  data: { label: string };
  position: { x: number; y: number };
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
}

export type View = 'todo' | 'notes' | 'mindmap' | 'calendar';
