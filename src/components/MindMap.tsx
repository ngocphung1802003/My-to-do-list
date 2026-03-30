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
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Trash2, Palette, Type } from 'lucide-react';
import { Button } from './Button';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '../lib/utils';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 250, y: 250 },
    data: { label: 'Main Goal' },
    style: { background: '#ffffff', color: '#000000', border: '2px solid #3B82F6', borderRadius: '12px', width: 150 }
  },
];

const initialEdges: Edge[] = [];

const COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'White', value: '#ffffff' },
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

  useEffect(() => {
    localStorage.setItem('aurora-mindmap-nodes', JSON.stringify(nodes));
    localStorage.setItem('aurora-mindmap-edges', JSON.stringify(edges));
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, style: { stroke: '#3B82F6', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const onSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: Node[] }) => {
    setSelectedNodeId(selectedNodes.length > 0 ? selectedNodes[0].id : null);
  }, []);

  const addNode = () => {
    const currentNode = nodes.find((n) => n.id === selectedNodeId);

    // Tính toán vị trí: Nếu có node đang chọn thì cộng thêm x, nếu không thì random
    const newNodePosition = currentNode
      ? { x: currentNode.position.x + 200, y: currentNode.position.y }
      : { x: Math.random() * 400, y: Math.random() * 400 };

    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      position: newNodePosition,
      data: { label: nodeName || 'New Node' },
      style: { background: '#ffffff', color: '#000000', border: '1px solid #3B82F6', borderRadius: '12px', width: 150 }
    };

    setNodes((nds) => nds.concat(newNode));

    // Nếu đang chọn một node, tự động nối dây từ node đó sang node mới
    if (selectedNodeId) {
      const newEdge: Edge = {
        id: `e-${selectedNodeId}-${newNodeId}`,
        source: selectedNodeId,
        target: newNodeId,
        style: { stroke: '#3B82F6', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }

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
            style: {
              ...node.style,
              background: color,
              color: color === '#ffffff' ? '#000000' : '#ffffff',
              border: color === '#ffffff' ? '1px solid #3B82F6' : 'none'
            },
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
          return { ...node, data: { ...node.data, label } };
        }
        return node;
      })
    );
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="flex flex-col gap-6 h-full bg-white text-black">
      <div className="flex justify-between items-end px-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Mind Map</h2>
          <p className="text-gray-400">Visualize connections and ideas.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl overflow-hidden relative border border-gray-100 shadow-inner">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          fitView
        >
          {/* Chấm đen trên nền trắng */}
          <Background color="#000" gap={25} variant="dots" size={1} opacity={0.1} />

          {/* Nút Zoom/Lock màu đen đậm dễ nhìn */}
          <Controls className="fill-black border-2 border-gray-200 bg-white shadow-xl !flex !flex-row !bottom-5 !left-5 !static" />

          <Panel position="top-left" className="flex flex-col gap-3">
            <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl flex flex-col gap-4 shadow-xl border border-gray-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600">
                <Plus className="w-3 h-3" /> Create Node
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Node label..."
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none text-black w-48"
                />
                <Button size="sm" onClick={addNode} className="bg-blue-600 text-white hover:bg-blue-700">
                  Add Node
                </Button>
              </div>

              {selectedNodeId && (
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <Button variant="danger" size="sm" onClick={deleteSelectedNode} className="w-full">
                    Delete Node
                  </Button>
                </div>
              )}
            </div>

            {selectedNode && (
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl flex flex-col gap-4 shadow-xl border border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600">
                  <Palette className="w-3 h-3" /> Customize
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Label</span>
                  <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => updateNodeLabel(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-black"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Color</span>
                  <div className="flex gap-1.5">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => updateNodeColor(color.value)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-all",
                          selectedNode.style?.background === color.value ? "border-black scale-110" : "border-transparent"
                        )}
                        style={{ background: color.value }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};