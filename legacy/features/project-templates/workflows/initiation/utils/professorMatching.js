/**
 * Helper to safely extract a professor's research interests or specialties array.
 * 
 * @param {Object} professor
 * @returns {Array}
 */
export function getProfessorInterests(professor = {}) {
  const { researchInterests = [], specialties = [] } = professor;
  return researchInterests.length > 0 ? researchInterests : specialties;
}

/**
 * Determines if a professor has reached their supervision capacity or is not accepting projects.
 * 
 * @param {Object} professor
 * @returns {boolean}
 */
export function isProfessorFull(professor = {}) {
  const {
    currentProjectCount = 0,
    maxSupervisionCapacity,
    isAcceptingProjects = true,
  } = professor;

  const hasLimit =
    maxSupervisionCapacity !== undefined &&
    maxSupervisionCapacity !== null &&
    Number(maxSupervisionCapacity) > 0;

  return !isAcceptingProjects || (hasLimit && Number(currentProjectCount) >= Number(maxSupervisionCapacity));
}

/**
 * Determines if a professor is a domain expert for a given primary discipline.
 * 
 * @param {Object} professor
 * @param {string|null} primaryDiscipline
 * @returns {boolean}
 */
export function isDomainExpert(professor = {}, primaryDiscipline) {
  if (!primaryDiscipline) return false;

  const profInterests = getProfessorInterests(professor);

  return profInterests.some((spec) => {
    const specStr = typeof spec === 'object' ? (spec.name || '') : String(spec);
    return (
      specStr.toLowerCase().includes(primaryDiscipline.toLowerCase()) ||
      primaryDiscipline.toLowerCase().includes(specStr.toLowerCase())
    );
  });
}