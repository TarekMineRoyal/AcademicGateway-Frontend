import React from 'react';
import dagre from '@dagrejs/dagre';
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/**
 * CustomMilestoneNode
 * High-fidelity custom dashboard card component mapped inside the React Flow canvas.
 */
function CustomMilestoneNode({ data }) {
  return (
    <div className="w-[220px] bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs hover:border-primary transition-all duration-150 relative">
      {/* Target connection terminal handle pin on Left bound */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-slate-300 !w-2 !h-2" 
      />
      
      {/* Card Interior Content */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
          {data.title}
        </h4>
        <span className="text-[10px] font-medium text-slate-400 mt-2 block">
          ⏱️ {data.expectedHours || 0} hrs allocated
        </span>
      </div>

      {/* Source connection terminal handle pin on Right bound */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-slate-300 !w-2 !h-2" 
      />
    </div>
  );
}

/**
 * Calculates dynamic coordinate geometries deterministically using Dagre engine.
 */
const getLayoutedElements = (milestones) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Configure the systems layout canvas parameters
  dagreGraph.setGraph({ 
    rankdir: 'LR', 
    nodesep: 50,  // Vertical gap between concurrent nodes
    ranksep: 100  // Horizontal gap between generation columns
  });

  // 1. Register nodes into the mathematical grid engine
  milestones.forEach((m) => {
    dagreGraph.setNode(m.id, { width: 220, height: 110 });
  });

  // 2. Register dependency edge relationships
  milestones.forEach((m) => {
    const prIds = m.prerequisiteIds || [];
    prIds.forEach((predId) => {
      dagreGraph.setEdge(predId, m.id);
    });
  });

  // 3. Compute layout coordinate geometries
  dagre.layout(dagreGraph);

  // 4. Map calculated X/Y coordinates back to React Flow shapes
  const nodes = milestones.map((m) => {
    const nodeWithPosition = dagreGraph.node(m.id) || { x: 0, y: 0 };
    return {
      id: m.id,
      type: 'customMilestone',
      position: {
        x: nodeWithPosition.x - 110, // Offset half width for absolute centering
        y: nodeWithPosition.y - 55,  // Offset half height for absolute centering
      },
      data: { ...m }
    };
  });

  // 5. Build edge connectors with directional arrow lines
  const edges = [];
  milestones.forEach((m) => {
    const prIds = m.prerequisiteIds || [];
    const depTypes = m.dependencyTypes || {};
    
    prIds.forEach((predId) => {
      // Type 2 represents concurrent Start-to-Start path rules
      const isStartToStart = depTypes[predId] === 2;
      
      edges.push({
        id: `e-${predId}-${m.id}`,
        source: predId,
        target: m.id,
        type: 'smoothstep', // Generates beautiful, clean 90-degree vector breaks
        animated: isStartToStart, // Animate concurrent paths to imply continuous sync
        style: { 
          stroke: isStartToStart ? '#3b82f6' : '#cbd5e1', 
          strokeWidth: 2 
        },
        markerEnd: { 
          type: 'arrowclosed', 
          color: isStartToStart ? '#3b82f6' : '#cbd5e1' 
        }
      });
    });
  });

  return { nodes, edges };
};

/**
 * SwimlaneStrategyLayout
 * Fully interactive, auto-layout Directed Acyclic Graph (DAG) Pipeline Map using React Flow and Dagre.
 *
 * @param {Object} props
 * @param {Array} props.milestones - Normalized milestones array from parent shell
 */
export function SwimlaneStrategyLayout({ milestones = [] }) {
  const { nodes, edges } = getLayoutedElements(milestones);

  return (
    <div className="w-full h-[500px] border border-slate-200/60 bg-slate-50/50 rounded-card overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ customMilestone: CustomMilestoneNode }}
        fitView // Automatically center-zooms to fit the computed DAG matrix neatly
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={16} size={1} />
        <Controls showInteractive={false} className="shadow-xs border border-slate-200 rounded" />
      </ReactFlow>
    </div>
  );
}