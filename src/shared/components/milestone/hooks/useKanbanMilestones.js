import { useMemo } from 'react';
import { DependencyType } from '../../../constants/enums';

/**
 * useKanbanMilestones
 * Isolates graph dependency calculations for milestone tracks.
 * Categorizes milestones into ready-to-initialize and sequence-locked tracks based on prerequisite types.
 *
 * @param {Array} milestones - Array of milestone objects
 * @returns {{ readyMilestones: Array, lockedMilestones: Array }} Categorized milestone tracks
 */
export function useKanbanMilestones(milestones = []) {
  return useMemo(() => {
    // Isolate the IDs of independent milestones (nodes with absolute zero prerequisites)
    const independentIds = new Set(
      milestones
        .filter((m) => !m.prerequisiteIds || m.prerequisiteIds.length === 0)
        .map((m) => m.id)
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
        (predId) =>
          independentIds.has(predId) &&
          milestone.dependencyTypes?.[predId] === DependencyType.START_TO_START
      );

      if (!hasFSDependency && fulfillsParallelTrackRule) {
        readyMilestones.push(milestone);
      } else {
        // Sequence Locked: Possesses FS constraints or parent nodes themselves are locked
        lockedMilestones.push(milestone);
      }
    });

    return { readyMilestones, lockedMilestones };
  }, [milestones]);
}