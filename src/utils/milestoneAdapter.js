/**
 * Normalizes backend blueprint payloads into a strict client-side data contract.
 * Aggregates the separate dependencies edge array directly into the milestone nodes.
 * Elevated to global utils to allow shared access across both template previews 
 * and live project workspace instances without causing cross-feature coupling.
 */
export function adaptMilestones(rawMilestones = [], rawDependencies = []) {
  return rawMilestones.map((milestone) => {
    // 1. Defensively resolve backend casing variances
    const id = milestone.id || milestone.Id;
    const title = milestone.title || milestone.Title || '';
    const description = milestone.description || milestone.Description || '';
    const expectedHours = milestone.expectedEffortInHours !== undefined 
      ? milestone.expectedEffortInHours 
      : (milestone.ExpectedEffortInHours || 0);
    const deliverableType = milestone.requiredDeliverableType !== undefined 
      ? milestone.requiredDeliverableType 
      : (milestone.RequiredDeliverableType || 0);

    // 2. Filter the incoming dependencies matrix to isolate prerequisites blocking THIS node
    const relatedEdges = rawDependencies.filter(
      (dep) => (dep.successorId || dep.SuccessorId) === id
    );

    // 3. Map out an array of strict predecessor string GUIDs
    const prerequisiteIds = relatedEdges.map(
      (dep) => dep.predecessorId || dep.PredecessorId
    );

    // 4. Build a dictionary mapping each predecessor ID to its relation type (e.g., 1 = FS, 2 = SS)
    const dependencyTypes = relatedEdges.reduce((acc, dep) => {
      const predId = dep.predecessorId || dep.PredecessorId;
      const type = dep.type !== undefined ? dep.type : dep.Type;
      if (predId) acc[predId] = type;
      return acc;
    }, {});

    return {
      id,
      title,
      description,
      expectedHours,
      deliverableType,
      prerequisiteIds,
      dependencyTypes,
      tasks: milestone.tasks || milestone.Tasks || [],
    };
  });
}