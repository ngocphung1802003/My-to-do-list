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
import { Plus, Trash2, Palette, Type, ChevronRight } from 'lucide-react';
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
  transition: 'all 0.2s ease'
};

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: '1', position: { x: 250, y: 250 }, data: { label: '🎯 Central Idea' }, style: { ...nodeStyle, border: '2px solid #3B82F6' } }
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeName, setNodeName] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onConnect: OnConnect = useCallback((params) =>
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } }, eds)),
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
      data: { label: nodeName || 'New Concept' },
      style: { ...nodeStyle, border: currentNode ? `1px solid ${currentNode.style?.border?.split(' ')[2] || '#3B82F6'}` : '1px solid #3B82F6' }
    };

    setNodes((nds) => nds.concat(newNode));
    if (selectedNodeId) {
      setEdges((eds) => addEdge({ id: `e-${selectedNodeId}-${newNodeId}`, source: selectedNodeId, target: newNodeId, animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } }, eds));
    }
    setNodeName('');
  };

  // Cập nhật tên node đang chọn
  const updateNodeLabel = (label: string) => {
    setNodes((nds) => nds.map((n) => n.id === selectedNodeId ? { ...n, data: { ...n.data, label } } : n));
  };

  // Cập nhật màu node đang chọn
  const updateNodeColor = (color: string) => {
    setNodes((nds) => nds.map((n) => n.id === selectedNodeId ? { ...n, style: { ...n.style, border: `2px solid ${color}` } } : n));
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col h-full bg-white text-black p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-black tracking-tighter text-black">MIND MAP</h2>
        <div className="h-1 w-12 bg-blue-600 rounded-full mt-1" />
      </div>

      <div className="flex-1 bg-[#fafafa] rounded-[32px] overflow-hidden relative border border-gray-100 shadow-inner">
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={onConnect} onSelectionChange={onSelectionChange}
          fitView
        >
          <Background color="#000" gap={25} variant={BackgroundVariant.Dots} size={1} opacity={0.08} />
          <Controls className="!bg-white !border-gray-200 !shadow-2xl !rounded-xl !fill-black scale-110" />

          {/* PANEL TẠO NODE NHANH */}
          <Panel position="top-left" className="m-4">
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex gap-2 items-center">
              <input
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="Ý tưởng mới..."
                className="bg-transparent px-4 py-2 text-sm outline-none w-40 font-medium"
              />
              <Button onClick={addNode} size="sm" className="bg-black text-white hover:bg-blue-600 transition-colors rounded-xl px-4">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </Panel>

          {/* FLOATING INSPECTOR: Chỉ hiện khi chọn Node */}
          {selectedNode && (
            <Panel position="top-right" className="m-4">
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-[24px] shadow-2xl border border-gray-100 w-64 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Edit Node</span>
                  <button onClick={() => setSelectedNodeId(null)} className="text-gray-400 hover:text-black">×</button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Label</label>
                  <div className="relative">
                    <input
                      value={selectedNode.data.label}
                      onChange={(e) => updateNodeLabel(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-semibold focus:border-blue-400 outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Theme Color</label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => updateNodeColor(c.value)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                          selectedNode.style?.border?.includes(c.value) ? "border-black" : "border-transparent"
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