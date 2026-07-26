/**
 * Evaluates whether a professor has reached their maximum supervision capacity 
 * or is currently not accepting new projects.
 * 
 * @param {Object|null|undefined} professor - The professor data object.
 * @returns {boolean} True if the professor is full or not accepting projects, false otherwise.
 */
export function isProfessorFull(professor) {
  if (!professor) return false;

  const {
    isAcceptingProjects,
    currentProjectCount,
    maxSupervisionCapacity
  } = professor;

  // Edge Case 1: Immediately full if explicitly not accepting projects
  if (isAcceptingProjects === false) {
    return true;
  }

  // Edge Case 2: Safely handle undefined/null capacity or count
  if (
    currentProjectCount === undefined || 
    currentProjectCount === null ||
    maxSupervisionCapacity === undefined || 
    maxSupervisionCapacity === null
  ) {
    return false;
  }

  // Edge Case 3: Standard numeric comparison
  return Number(currentProjectCount) >= Number(maxSupervisionCapacity);
}