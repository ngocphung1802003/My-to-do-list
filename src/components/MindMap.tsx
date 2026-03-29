import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  Connection, 
  Edge, 
  Node,
  useNodesState,
  useEdgesState,
  Panel,
  OnNodesChange,
  applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Trash2, Palette, Type } from 'lucide-react';
import { Button } from './Button';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '../lib/utils';

const initialNodes: Node[] = [
  { 
    id: '1', 
    position: { x: 250, y: 100 }, 
    data: { label: 'Main Goal' }, 
    className: 'glass-node',
    style: { background: '#F8FAFC', color: '#1e293b' }
  },
];

const initialEdges: Edge[] = [];

const COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'White', value: '#F8FAFC' },
];

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    localStorage.getItem('aurora-mindmap-nodes')
      ? JSON.parse(localStorage.getItem('aurora-mindmap-nodes')!)
      : initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    localStorage.getItem('aurora-mindmap-edges')
      ? JSON.parse(localStorage.getItem('aurora-mindmap-edges')!)
      : initialEdges
  );
  const [nodeName, setNodeName] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('aurora-mindmap-nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('aurora-mindmap-edges', JSON.stringify(edges));
  }, [edges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodeId(nodes.length > 0 ? nodes[0].id : null);
  }, []);

  const addNode = () => {
    const newNode: Node = {
      id: uuidv4(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: nodeName || 'New Node' },
      className: 'glass-node',
      style: { background: '#F8FAFC', color: '#1e293b' }
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeName('');
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
  };

  const updateNodeColor = (color: string) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            style: { ...node.style, background: color, color: color === '#F8FAFC' ? '#1e293b' : '#fff' },
          };
        }
        return node;
      })
    );
  };

  const updateNodeLabel = (label: string) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: { ...node.data, label },
          };
        }
        return node;
      })
    );
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Mind Map</h2>
          <p className="text-white/50">Visualize connections and ideas.</p>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-3xl overflow-hidden relative border-white/10">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          fitView
        >
          <Background color="rgba(255,255,255,0.1)" gap={20} />
          <Controls className="!bg-white/10 !border-white/20 !fill-white" />
          
          <Panel position="top-left" className="flex flex-col gap-3">
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 shadow-2xl border-white/20">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70">
                <Plus className="w-3 h-3" /> Create Node
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Node label..."
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none text-white placeholder:text-white/40 w-48"
                />
                <Button size="sm" onClick={addNode} className="rounded-xl whitespace-nowrap bg-white text-[#1E88E5] hover:bg-white/90">
                  Add Node
                </Button>
              </div>
              
              {selectedNodeId && (
                <div className="pt-4 border-t border-white/10 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70">
                      <Trash2 className="w-3 h-3" /> Actions
                    </div>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={deleteSelectedNode}
                      className="rounded-xl py-1 px-3 text-[10px]"
                    >
                      Delete Selected
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {selectedNode && (
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-300 border-white/20">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70">
                  <Palette className="w-3 h-3" /> Customize Node
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
                    <Type className="w-3 h-3" /> Label
                  </div>
                  <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => updateNodeLabel(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none text-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
                    <Palette className="w-3 h-3" /> Color
                  </div>
                  <div className="flex gap-1.5">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => updateNodeColor(color.value)}
                        className={cn(
                          "w-7 h-7 rounded-full border-2 transition-all hover:scale-110 active:scale-90",
                          selectedNode.style?.background === color.value 
                            ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                            : "border-white/20 hover:border-white/50"
                        )}
                        style={{ background: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Panel>

          <Panel position="bottom-right" className="bg-white/5 backdrop-blur-md p-2 rounded-xl border border-white/10 text-[10px] text-white/30">
            Click node to edit • Drag to move • Connect dots to link
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};
