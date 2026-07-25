import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import dagre from '@dagrejs/dagre';
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DependencyType } from '../../../constants/enums';
import { useKeyDown } from '../../../hooks/useKeyDown';
import { MilestoneDetailsDrawer } from '../MilestoneDetailsDrawer';

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

CustomMilestoneNode.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    expectedHours: PropTypes.number,
  }).isRequired,
};

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
      const isStartToStart = depTypes[predId] === DependencyType.START_TO_START;
      
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
 * GraphStrategyLayout
 * Fully interactive, auto-layout Directed Acyclic Graph (DAG) Pipeline Map using React Flow and Dagre.
 *
 * @param {Object} props
 * @param {Array} props.milestones - Normalized milestones array from parent shell
 * @param {boolean} props.isWorkspace - Flags if visualization runs inside a live execution instance
 * @param {string|null} props.selectedMilestoneId - The unique ID of the currently focused milestone
 * @param {Function} props.onSelectMilestone - Dispatch callback to update active milestone context
 */
export function GraphStrategyLayout({ 
  milestones = [], 
  isWorkspace = false,
  selectedMilestoneId = null,
  onSelectMilestone = () => {}
}) {
  // 1. Local state block handling slide-out modal / drawer lifecycle (Only used in static template previews)
  const [activeMilestoneDetails, setActiveMilestoneDetails] = useState(null);

  // Memoize layout baseline coordinate generation to isolate rendering threads
  const { nodes, edges } = useMemo(() => getLayoutedElements(milestones), [milestones]);

  // Append dynamic focus highlighting styles smoothly without breaking structural canvas coordinates
  const visualNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      style: node.id === selectedMilestoneId 
        ? { 
            border: '2px solid #4f46e5', 
            borderRadius: '0.5rem', 
            boxShadow: '0 0 0 4px rgba(79, 70, 229, 0.15)' 
          }
        : {}
    }));
  }, [nodes, selectedMilestoneId]);

  // 2. React Flow selection payload adapter
  const handleNodeSelection = (nodeData) => {
    if (isWorkspace) {
      // Tunnel click directly back to root tracking state[cite: 1, 3]
      onSelectMilestone(nodeData.id);
    } else {
      // Fallback to static descriptive drawer panels solely for model templates preview[cite: 3]
      setActiveMilestoneDetails(nodeData);
    }
  };

  // 3. Handle keyboard shortcuts using useKeyDown hook[cite: 4]
  useKeyDown('Escape', () => {
    if (activeMilestoneDetails) {
      setActiveMilestoneDetails(null);
    }
  });

  return (
    <div className="w-full h-[500px] border border-slate-200/60 bg-slate-50/50 rounded-card overflow-hidden relative">
      <ReactFlow
        nodes={visualNodes}
        edges={edges}
        nodeTypes={{ customMilestone: CustomMilestoneNode }}
        onNodeClick={(event, node) => handleNodeSelection(node.data)} // Native Event binding configuration[cite: 3]
        fitView // Automatically center-zooms to fit the computed DAG matrix neatly on initialization[cite: 3]
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={16} size={1} />
        <Controls showInteractive={false} className="shadow-xs border border-slate-200 rounded" />
      </ReactFlow>

      {/* 4. Stateful Slide-Out Floating Card Overlay Drawer Container (Template Mode Exclusively)[cite: 3] */}
      {!isWorkspace && (
        <MilestoneDetailsDrawer
          milestone={activeMilestoneDetails}
          onClose={() => setActiveMilestoneDetails(null)}
        />
      )}
    </div>
  );
}

GraphStrategyLayout.propTypes = {
  milestones: PropTypes.array,
  isWorkspace: PropTypes.bool,
  selectedMilestoneId: PropTypes.string,
  onSelectMilestone: PropTypes.func,
};