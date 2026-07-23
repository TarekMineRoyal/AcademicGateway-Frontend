/**
 * milestoneUtils.js
 * Pure utility functions for milestone data normalization and index lookups.
 */

/**
 * Extracts and normalizes the task label from a task entry (string or object).
 *
 * @param {string|Object} task - The task item to normalize
 * @returns {string} Clean task label string
 */
export function getTaskLabel(task) {
  if (typeof task === 'string') {
    return task;
  }
  if (task && typeof task === 'object') {
    return task.title || task.Name || 'Untitled Objective';
  }
  return 'Untitled Objective';
}

/**
 * Safely retrieves associated task items from a milestone object regardless of casing variation.
 *
 * @param {Object|null} milestone - The milestone object
 * @returns {Array} Array of tasks
 */
export function getAssociatedTasks(milestone) {
  if (!milestone) return [];
  return milestone.tasks || milestone.Tasks || [];
}

/**
 * Resolves sequential index and title for a prerequisite milestone from a master list.
 *
 * @param {Array} allMilestones - Array of all milestone objects
 * @param {string} predId - The prerequisite milestone ID to look up
 * @returns {{ sequenceNum: (number|string), title: string }} Resolved milestone metadata
 */
export function getMilestoneSequenceInfo(allMilestones = [], predId) {
  const masterIndex = allMilestones.findIndex((m) => m.id === predId);
  if (masterIndex === -1) {
    return { sequenceNum: '?', title: 'Unknown Milestone' };
  }
  return {
    sequenceNum: masterIndex + 1,
    title: allMilestones[masterIndex].title || 'Unknown Milestone',
  };
}