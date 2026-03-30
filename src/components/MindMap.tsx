import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  OnConnect,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Trash2, Palette } from 'lucide-react';
import { Button } from './Button';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '../lib/utils';

const COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Black', value: '#1f2937' },
];

const nodeStyle = {
  background: '#ffffff',
  color: '#1f2937',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '10px 16px',
  fontSize: '13px',
  fontWeight: '600',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
};

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: '1', position: { x: 250, y: 250 }, data: { label: '🎯 Central Idea' }, style: { ...nodeStyle, border: '2px solid #3B82F6' } }
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeName, setNodeName] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onConnect: OnConnect = useCallback((params) =>
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#3B82F6', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' }
    }, eds)),
    [setEdges]);

  const onSelectionChange = useCallback(({ nodes: selNodes }: { nodes: Node[] }) => {
    setSelectedNodeId(selNodes.length > 0 ? selNodes[0].id : null);
  }, []);

  const addNode = () => {
    const currentNode = nodes.find((n) => n.id === selectedNodeId);
    const newNodeId = uuidv4();
    const newPos = currentNode
      ? { x: currentNode.position.x + 220, y: currentNode.position.y + 40 }
      : { x: 400, y: 400 };

    const newNode: Node = {
      id: newNodeId,
      position: newPos,
      data: { label: nodeName || 'New Node' },
      style: { ...nodeStyle, border: '1px solid #3B82F6' }
    };

    setNodes((nds) => nds.concat(newNode));
    if (selectedNodeId) {
      setEdges((eds) => addEdge({
        id: `e-${selectedNodeId}-${newNodeId}`,
        source: selectedNodeId,
        target: newNodeId,
        animated: true,
        style: { stroke: '#3B82F6', strokeWidth: 2 }
      }, eds));
    }
    setNodeName('');
  };

  const updateNodeLabel = (label: string) => {
    setNodes((nds) => nds.map((n) => n.id === selectedNodeId ? { ...n, data: { ...n.data, label } } : n));
  };

  const updateNodeColor = (color: string) => {
    setNodes((nds) => nds.map((n) => n.id === selectedNodeId ? { ...n, style: { ...n.style, border: `2px solid ${color}` } } : n));
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col gap-6 h-full text-white">
      {/* CSS cho nút bấm Uiverse */}
      <style>{`
        .uiverse-button {
          border: 2px solid #24b4fb;
          background-color: #24b4fb;
          border-radius: 0.9em;
          cursor: pointer;
          padding: 0.5em 1.2em;
          transition: all ease-in-out 0.2s;
          font-size: 14px;
        }
        .uiverse-button span {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-weight: 600;
          gap: 4px;
        }
        .uiverse-button:hover {
          background-color: #0071e2;
          border-color: #0071e2;
          transform: translateY(-1px);
        }
        .uiverse-button:active {
          transform: scale(0.95);
        }
      `}</style>

      <div className="flex justify-between items-end px-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Mind Map</h2>
          <p className="opacity-60">Visualize connections and ideas.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[32px] overflow-hidden relative border border-white/20 shadow-2xl">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          fitView
        >
          <Background color="#000000" gap={25} variant={BackgroundVariant.Dots} size={1} opacity={0.1} />

          <Controls className="!bg-white !border-gray-200 !shadow-xl !fill-black scale-110 !left-6 !bottom-6" />

          <Panel position="top-left" className="m-4">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-4 w-64 text-black">
              <div className="text-[10px] font-bold uppercase text-blue-600 tracking-widest">Create Node</div>
              <div className="flex gap-2">
                <input
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="Ý tưởng mới..."
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-black outline-none w-full"
                />
                {/* Thay thế nút Button cũ bằng cấu trúc Uiverse */}
                <button className="uiverse-button" onClick={addNode}>
                  <span>
                    <Plus className="w-4 h-4" /> Add
                  </span>
                </button>
              </div>
            </div>
          </Panel>

          {selectedNode && (
            <Panel position="top-right" className="m-4">
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-[24px] shadow-2xl border border-gray-100 w-64 flex flex-col gap-4 text-black animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-blue-600">Edit Node</span>
                  <button onClick={() => setSelectedNodeId(null)} className="text-gray-400">×</button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400">LABEL</label>
                  <input
                    value={selectedNode.data.label}
                    onChange={(e) => updateNodeLabel(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-semibold text-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400">THEME COLOR</label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => updateNodeColor(c.value)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-all",
                          selectedNode.style?.border?.includes(c.value) ? "border-black scale-110" : "border-transparent"
                        )}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNodes(nds => nds.filter(n => n.id !== selectedNodeId));
                    setSelectedNodeId(null);
                  }}
                  className="mt-2 w-full py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Node
                </button>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};