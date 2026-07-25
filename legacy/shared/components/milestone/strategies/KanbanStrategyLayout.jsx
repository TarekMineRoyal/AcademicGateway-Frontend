import PropTypes from 'prop-types';
import { KanbanMilestoneCard } from '../KanbanMilestoneCard';
import { KanbanColumn } from '../KanbanColumn';
import { useKanbanMilestones } from '../hooks/useKanbanMilestones';

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
  const { readyMilestones, lockedMilestones } = useKanbanMilestones(milestones);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
      {/* COLUMN 1: READY TO INITIALIZE */}
      <KanbanColumn
        title="Ready to Initialize"
        count={readyMilestones.length}
        badge={<span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
        titleClassName="text-brand-dark"
        emptyMessage="No actionable tracks available to initialize"
      >
        {readyMilestones.map((milestone) => (
          <KanbanMilestoneCard
            key={milestone.id}
            milestone={milestone}
            isSelected={milestone.id === selectedMilestoneId}
            isLocked={false}
            onClick={onSelectMilestone}
            allMilestones={milestones}
          />
        ))}
      </KanbanColumn>

      {/* COLUMN 2: SEQUENCE LOCKED */}
      <KanbanColumn
        title="Sequence Locked"
        count={lockedMilestones.length}
        badge={
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-extrabold uppercase tracking-tight shrink-0">
            Locked
          </span>
        }
        titleClassName="text-slate-500"
        emptyMessage="All sequence paths resolved and unfettered"
      >
        {lockedMilestones.map((milestone) => (
          <KanbanMilestoneCard
            key={milestone.id}
            milestone={milestone}
            isSelected={milestone.id === selectedMilestoneId}
            isLocked={true}
            onClick={onSelectMilestone}
            allMilestones={milestones}
          />
        ))}
      </KanbanColumn>
    </div>
  );
}

KanbanStrategyLayout.propTypes = {
  milestones: PropTypes.array,
  selectedMilestoneId: PropTypes.string,
  onSelectMilestone: PropTypes.func,
};