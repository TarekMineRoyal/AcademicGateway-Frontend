import React, { useState, useEffect, useMemo } from 'react';
import dagre from '@dagrejs/dagre';
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DependencyType } from '../../../constants/enums';

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
 */
export function GraphStrategyLayout({ milestones = [] }) {
  // 1. Local state block handling slide-out modal / drawer lifecycle
  const [activeMilestoneDetails, setActiveMilestoneDetails] = useState(null);

  // Memoize graph elements computation to avoid redundant calculations across overlay visibility changes
  const { nodes, edges } = useMemo(() => getLayoutedElements(milestones), [milestones]);

  // 2. React Flow selection payload adapter
  const handleNodeSelection = (nodeData) => {
    setActiveMilestoneDetails(nodeData);
  };

  // 3. Document keyboard interception to support safe Escape key dismissals
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveMilestoneDetails(null);
      }
    };

    if (activeMilestoneDetails) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMilestoneDetails]);

  // 4. Safely resolve backend payload array casing variances for underlying work matrices
  const associatedTasks = activeMilestoneDetails?.tasks || activeMilestoneDetails?.Tasks || [];

  return (
    <div className="w-full h-[500px] border border-slate-200/60 bg-slate-50/50 rounded-card overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ customMilestone: CustomMilestoneNode }}
        onNodeClick={(event, node) => handleNodeSelection(node.data)} // Native Event binding configuration
        fitView // Automatically center-zooms to fit the computed DAG matrix neatly on initialization
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={16} size={1} />
        <Controls showInteractive={false} className="shadow-xs border border-slate-200 rounded" />
      </ReactFlow>

      {/* 5. Stateful Slide-Out Premium Floating Card Overlay Container */}
      {activeMilestoneDetails && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end animate-fade-in"
          onClick={() => setActiveMilestoneDetails(null)} // Seamless background vector backdrop tap dismissal
        >
          <div 
            className="bg-white h-full w-full max-w-md p-6 shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()} // Stop bubble events from closing drawer unexpectedly on interior interaction
          >
            {/* Drawer Section Scroll Container Area */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-6">
              
              {/* Header Context Action Container */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black text-brand-dark mb-2">
                    {activeMilestoneDetails.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {activeMilestoneDetails.description || "No supplemental descriptions attached to this blueprint checkpoint blueprint."}
                  </p>
                </div>
                
                {/* Close Drawer Button */}
                <button
                  type="button"
                  onClick={() => setActiveMilestoneDetails(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors duration-150 p-1 rounded-md cursor-pointer ml-4"
                  aria-label="Dismiss details"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scope & Effort Analytics Matrix */}
              <div className="grid grid-cols-2 gap-3.5 border-t border-b border-slate-100 py-4">
                <div className="bg-slate-50 p-3 border border-slate-100 rounded-lg">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Expected Effort
                  </span>
                  <span className="text-xs font-semibold text-slate-700 block">
                    ⏱️ {activeMilestoneDetails.expectedHours || 0} hrs allocated
                  </span>
                </div>
                
                <div className="bg-slate-50 p-3 border border-slate-100 rounded-lg">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Deliverable Type
                  </span>
                  <span className="text-xs font-semibold text-slate-700 block">
                    📦 Group Type Contract #{activeMilestoneDetails.deliverableType ?? 0}
                  </span>
                </div>
              </div>

              {/* Scope Checklist Stack Section */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Granular Checklist Breakdown
                </h4>
                
                {associatedTasks.length > 0 ? (
                  <div className="space-y-2">
                    {associatedTasks.map((task, index) => {
                      // Handle array strings, payload object maps or model properties dynamically
                      const taskLabel = typeof task === 'string' ? task : (task.title || task.Name || 'Untitled Objective');
                      return (
                        <div 
                          key={task.id || index}
                          className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600"
                        >
                          <input 
                            type="checkbox" 
                            disabled 
                            readOnly
                            checked={false} 
                            className="mt-0.5 rounded border-slate-300 text-brand-dark focus:ring-0 opacity-60 pointer-events-none"
                          />
                          <span className="leading-tight flex-1">{taskLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Informational Empty Notice State Handle Target */
                  <div className="p-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg text-xs font-medium italic text-center">
                    No granular tasks attached to this checkpoint blueprint.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}