import React, { useState } from 'react';
import { KanbanStrategyLayout } from './strategies/KanbanStrategyLayout';
import { GraphStrategyLayout } from './strategies/GraphStrategyLayout';

/**
 * MilestoneVisualizer
 * Master Strategy Shell Component that controls the layout toggle state 
 * and switches dynamically between different rendering engine strategy stubs.
 *
 * @param {Object} props
 * @param {Array} props.milestones - Strict array prop holding normalized items
 * @param {boolean} props.isWorkspace - Flags if visualization runs inside a live execution instance
 */
export default function MilestoneVisualizer({ milestones = [], isWorkspace = true }) {
  // String state controller to swap between strategy engine layouts
  // Lands on execution columns for workspaces, and defaults to holistic roadmaps for previews
  const [viewStrategy, setViewStrategy] = useState(isWorkspace ? 'kanban' : 'graph');

  return (
    <section className="space-y-4 w-full">
      {/* High-Fidelity Control Bar UI Styled as an Active Pill-Switch */}
      {/* Only render when in an active live workspace context, completely hide for static previews */}
      {isWorkspace && (
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-fit mb-6">
          <button
            type="button"
            onClick={() => setViewStrategy('kanban')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer ${
              viewStrategy === 'kanban'
                ? 'bg-white text-primary shadow-xs border border-slate-200/40'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Kanban View
          </button>
          
          <button
            type="button"
            onClick={() => setViewStrategy('graph')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer ${
              viewStrategy === 'graph'
                ? 'bg-white text-primary shadow-xs border border-slate-200/40'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Graph View
          </button>
        </div>
      )}

      {/* Dynamic Render Pipeline Engine Swap */}
      {/* If it's a static preview, bypass state entirely and force render GraphStrategyLayout exclusively */}
      {isWorkspace && viewStrategy === 'kanban' ? (
        <KanbanStrategyLayout milestones={milestones} />
      ) : (
        <GraphStrategyLayout milestones={milestones} />
      )}
    </section>
  );
}