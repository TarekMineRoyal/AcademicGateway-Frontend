import React from 'react';
import { DependencyType } from '../../../constants/enums';

/**
 * KanbanStrategyLayout
 * Fully functional, algorithm-driven Execution Kanban Board.
 * Separates milestones dynamically into "Ready to Initialize" and "Sequence Locked" tracks.
 *
 * @param {Object} props
 * @param {Array} props.milestones - Normalized milestones array from parent shell
 * @param {string|null} props.selectedMilestoneId - The unique ID of the currently focused milestone
 * @param {Function} props.onSelectMilestone - Dispatch callback to update active milestone context
 */
export function KanbanStrategyLayout({ milestones = [], selectedMilestoneId, onSelectMilestone }) {
  // ----------------------------------------------------
  // Step 1: Core Algorithmic Sorting Logic
  // ----------------------------------------------------
  
  // Isolate the IDs of independent milestones (nodes with absolute zero prerequisites)
  const independentIds = new Set(
    milestones.filter(m => !m.prerequisiteIds || m.prerequisiteIds.length === 0).map(m => m.id)
  );

  const readyMilestones = [];
  const lockedMilestones = [];

  milestones.forEach((milestone) => {
    const prIds = milestone.prerequisiteIds || [];

    // Rule 1: Immediate sorting for absolute zero prerequisites
    if (prIds.length === 0) {
      readyMilestones.push(milestone);
      return;
    }

    // Rule 2: Evaluate the Parallel Track Rule & Transitive Lock States
    // If it possesses any Finish-to-Start (Type 1) dependencies, it is locked.
    const hasFSDependency = prIds.some(
      (predId) => milestone.dependencyTypes?.[predId] === DependencyType.FINISH_TO_START
    );

    // To run concurrently (Ready), every single prerequisite must be an independent milestone 
    // AND must be tied via a Start-to-Start constraint (Dependency Type = 2).
    const fulfillsParallelTrackRule = prIds.every(
      (predId) => independentIds.has(predId) && milestone.dependencyTypes?.[predId] === DependencyType.START_TO_START
    );

    if (!hasFSDependency && fulfillsParallelTrackRule) {
      readyMilestones.push(milestone);
    } else {
      // Sequence Locked: Possesses FS constraints or parent nodes themselves are locked
      lockedMilestones.push(milestone);
    }
  });

  return (
    // Step 2: UI Grid Architecture (Tailwind v4 tokens)
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
      
      {/* ==================== COLUMN 1: READY TO INITIALIZE ==================== */}
      <div className="bg-slate-50/70 border border-slate-200/50 p-5 rounded-card min-h-[450px] flex flex-col">
        {/* Column Header with Indigo Dot Icon */}
        <h2 className="flex items-center gap-2 text-sm font-bold text-brand-dark uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
          Ready to Initialize
          <span className="text-xs font-normal text-slate-400 normal-case ml-auto">
            ({readyMilestones.length})
          </span>
        </h2>

        {/* Column Body / Kanban Cards Map */}
        <div className="flex-1 flex flex-col justify-start">
          {readyMilestones.length === 0 ? (
            /* Empty State Safeguard */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400 font-medium my-auto">
              <p>No actionable tracks available to initialize</p>
            </div>
          ) : (
            readyMilestones.map((milestone) => {
              const isSelected = milestone.id === selectedMilestoneId; // Check active selection state[cite: 1]
              return (
                /* Step 3: High-Fidelity Milestone Card Shell */
                <div
                  key={milestone.id}
                  onClick={() => onSelectMilestone?.(milestone.id)} // Emit update handling function[cite: 1]
                  className={`bg-white border p-4 rounded-lg shadow-2xs hover:shadow-sm transition-all duration-150 mb-3 last:mb-0 cursor-pointer ${
                    isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'
                  }`} // Visual selection focus toggling[cite: 1]
                >
                  {/* Card Upper Meta Row */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">
                      {milestone.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium shrink-0">
                      <span>⏱️</span>
                      <span>{milestone.expectedHours || 0} hrs</span>
                    </div>
                  </div>

                  {/* Card Body Text with line-clamp truncation */}
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 mb-3">
                    {milestone.description || 'No description provided for this milestone.'}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==================== COLUMN 2: SEQUENCE LOCKED ==================== */}
      <div className="bg-slate-50/70 border border-slate-200/50 p-5 rounded-card min-h-[450px] flex flex-col">
        {/* Column Header with Muted Indicator and Locking Badge */}
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-extrabold uppercase tracking-tight shrink-0">
            Locked
          </span>
          Sequence Locked
          <span className="text-xs font-normal text-slate-400 normal-case ml-auto">
            ({lockedMilestones.length})
          </span>
        </h2>

        {/* Column Body / Kanban Cards Map */}
        <div className="flex-1 flex flex-col justify-start">
          {lockedMilestones.length === 0 ? (
            /* Empty State Safeguard */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400 font-medium my-auto">
              <p>All sequence paths resolved and unfettered</p>
            </div>
          ) : (
            lockedMilestones.map((milestone) => {
              const isSelected = milestone.id === selectedMilestoneId; // Check active selection state[cite: 1]
              return (
                /* Step 3: High-Fidelity Milestone Card Shell */
                <div
                  key={milestone.id}
                  onClick={() => onSelectMilestone?.(milestone.id)} // Emit update handling function[cite: 1]
                  className={`bg-white border p-4 rounded-lg shadow-2xs hover:shadow-sm transition-all duration-150 mb-3 last:mb-0 cursor-pointer ${
                    isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'
                  }`} // Visual selection focus toggling[cite: 1]
                >
                  {/* Card Upper Meta Row */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">
                      {milestone.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium shrink-0">
                      <span>⏱️</span>
                      <span>{milestone.expectedHours || 0} hrs</span>
                    </div>
                  </div>

                  {/* Card Body Text with line-clamp truncation */}
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 mb-3">
                    {milestone.description || 'No description provided for this milestone.'}
                  </p>

                  {/* Prerequisite Blockers Badge UI with High-Context Names */}
                  <div className="mt-3 pt-2.5 border-t border-dashed border-slate-100 flex flex-wrap items-center gap-1.5">
                    {(milestone.prerequisiteIds || []).map((predId) => {
                      // Match prerequisite ID against the master milestones array to discover 1-indexed sequential positions and titles
                      const masterIndex = milestones.findIndex(m => m.id === predId);
                      const milestoneSequenceNum = masterIndex !== -1 ? masterIndex + 1 : '?';
                      const blockerTitle = masterIndex !== -1 ? milestones[masterIndex].title : 'Unknown Milestone';

                      return (
                        <span
                          key={predId}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase"
                          title={`Blocked by: ${blockerTitle}`}
                        >
                          🔒 Awaits M{milestoneSequenceNum}: {blockerTitle}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}