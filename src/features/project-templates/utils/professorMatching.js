/**
 * Helper to safely extract a professor's research interests or specialties array.
 * 
 * @param {Object} professor
 * @param {Array} [professor.researchInterests]
 * @param {Array} [professor.specialties]
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
 * @param {number} [professor.currentProjectCount=0]
 * @param {number|null} [professor.maxSupervisionCapacity]
 * @param {boolean} [professor.isAcceptingProjects=true]
 * @returns {boolean}
 */
export function isProfessorFull(professor = {}) {
  const {
    currentProjectCount = 0,
    maxSupervisionCapacity,
    isAcceptingProjects = true,
  } = professor;

  if (!isAcceptingProjects) {
    return true;
  }

  const hasLimit =
    maxSupervisionCapacity !== undefined &&
    maxSupervisionCapacity !== null &&
    Number(maxSupervisionCapacity) > 0;

  return hasLimit && Number(currentProjectCount) >= Number(maxSupervisionCapacity);
}

/**
 * Determines if a professor is a domain expert for a given primary discipline.
 * 
 * @param {Object} professor
 * @param {string|null} primaryDiscipline
 * @returns {boolean}
 */
export function isDomainExpert(professor = {}, primaryDiscipline = '') {
  if (!primaryDiscipline) return false;

  const interests = getProfessorInterests(professor);
  const targetDiscipline = primaryDiscipline.toLowerCase();

  return interests.some((spec) => {
    const specStr = typeof spec === 'object' ? spec.name || '' : String(spec);
    if (!specStr) return false;
    const normalizedSpec = specStr.toLowerCase();
    return (
      normalizedSpec.includes(targetDiscipline) ||
      targetDiscipline.includes(normalizedSpec)
    );
  });
}