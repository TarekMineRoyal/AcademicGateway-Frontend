import React, { useState } from 'react';
import { KanbanStrategyLayout } from './strategies/KanbanStrategyLayout';
import { SwimlaneStrategyLayout } from './strategies/SwimlaneStrategyLayout';

/**
 * MilestoneVisualizer
 * Master Strategy Shell Component that controls the layout toggle state 
 * and switches dynamically between different rendering engine strategy stubs.
 * * @param {Object} props
 * @param {Array} props.milestones - Strict array prop holding normalized items
 */
export default function MilestoneVisualizer({ milestones = [] }) {
  // String state controller to swap between strategy engine layouts
  const [viewStrategy, setViewStrategy] = useState('kanban'); // 'kanban' | 'swimlane'

  return (
    <section className="space-y-4 w-full">
      {/* High-Fidelity Control Bar UI Styled as an Active Pill-Switch */}
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
          onClick={() => setViewStrategy('swimlane')}
          className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer ${
            viewStrategy === 'swimlane'
              ? 'bg-white text-primary shadow-xs border border-slate-200/40'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Swimlane View
        </button>
      </div>

      {/* Dynamic Render Pipeline Engine Swap */}
      {viewStrategy === 'kanban' ? (
        <KanbanStrategyLayout milestones={milestones} />
      ) : (
        <SwimlaneStrategyLayout milestones={milestones} />
      )}
    </section>
  );
}