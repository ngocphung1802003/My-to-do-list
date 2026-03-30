import React, { useCallback, useState } from 'react';
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
  MarkerType,
  OnConnect,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { v4 as uuidv4 } from 'uuid';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 250, y: 250 },
    data: { label: 'Main Goal' },
    style: {
      background: '#ffffff',
      color: '#000000',
      border: '2px solid #3B82F6',
      borderRadius: '12px',
      width: 150,
      fontWeight: 'bold'
    }
  },
];

export const MindMap = () => {
  // 1. Khai báo đầy đủ State
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeName, setNodeName] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // 2. Hàm xử lý khi kết nối các node thủ công
  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({
        ...params,
        animated: true,
        style: { stroke: '#3B82F6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' }
      }, eds)),
    [setEdges]
  );

  // 3. Hàm theo dõi node nào đang được chọn
  const onSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: Node[] }) => {
    setSelectedNodeId(selectedNodes.length > 0 ? selectedNodes[0].id : null);
  }, []);

  // 4. Logic Add Node: Xuất hiện kế bên node cũ
  const addNode = () => {
    const currentNode = nodes.find((n) => n.id === selectedNodeId);

    // Nếu chọn 1 node, node mới cách 200px sang phải. Nếu không chọn, để ở vị trí mặc định.
    const newPos = currentNode
      ? { x: currentNode.position.x + 200, y: currentNode.position.y }
      : { x: 400, y: 400 };

    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      position: newPos,
      data: { label: nodeName || 'New Node' },
      style: {
        background: '#ffffff',
        color: '#000000',
        border: '1px solid #3B82F6',
        borderRadius: '12px',
        width: 150
      }
    };

    setNodes((nds) => nds.concat(newNode));

    // Tự động nối dây từ node cũ sang node mới
    if (selectedNodeId) {
      const newEdge: Edge = {
        id: `e-${selectedNodeId}-${newNodeId}`,
        source: selectedNodeId,
        target: newNodeId,
        animated: true,
        style: { stroke: '#3B82F6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }

    setNodeName('');
  };

  const deleteNode = () => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-white text-black">
      <div className="flex justify-between items-end px-4">
        <div>
          <h2 className="text-3xl font-bold text-black">Mind Map</h2>
          <p className="text-gray-500 italic">White background & Blue accents</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl overflow-hidden relative border border-gray-200 shadow-sm">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          fitView
        >
          {/* Giao diện chấm đen trên nền trắng */}
          <Background color="#000000" gap={20} variant={BackgroundVariant.Dots} size={1} opacity={0.1} />

          {/* Controls màu đen, viền đậm để dễ nhìn (Zoom/Lock) */}
          <Controls className="fill-black border-2 border-gray-400 bg-white shadow-xl scale-110 !left-5 !bottom-5" />

          <Panel position="top-left" className="p-4">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-200 flex flex-col gap-4">
              <div className="text-[10px] font-bold uppercase text-blue-600 tracking-widest">Create Node</div>
              <div className="flex gap-2">
                <input
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="Enter name..."
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-black outline-none w-40 focus:ring-1 focus:ring-blue-500"
                />
                <Button size="sm" onClick={addNode} className="bg-blue-600 text-white hover:bg-blue-700">
                  Add Node
                </Button>
              </div>
              {selectedNodeId && (
                <Button size="sm" variant="danger" onClick={deleteNode} className="w-full flex gap-2">
                  <Trash2 className="w-4 h-4" /> Delete selected
                </Button>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};