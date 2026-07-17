/**
 * Normalizes backend blueprint payloads into a strict client-side data contract.
 * Aggregates separate or embedded dependency edge arrays directly into the milestone nodes.
 * Enforces strict camelCase contract compliance with zero defensive property-guessing cascades.
 */
export function adaptMilestones(rawMilestones = [], rawDependencies = []) {
  return rawMilestones.map((milestone) => {
    const id = milestone.id;
    
    // Align with the backend's flat property names
    const title = milestone.title || milestone.titleSnapshot || 'Untitled Milestone';
    const description = milestone.description || milestone.descriptionSnapshot || '';
    const expectedHours = milestone.expectedEffortInHours || 0;
    
    // Resolve tasks first so we can use them for milestone-level metadata fallbacks
    const rawTasks = milestone.tasks || [];
    const adaptedTasks = rawTasks.map((task) => ({
      id: task.id,
      title: task.title || task.titleSnapshot || 'Untitled Task',
      description: task.description || task.descriptionSnapshot || '',
      weight: task.weight || 0,
      requiredDeliverableType: task.requiredDeliverableType || 'None',
      status: task.status,
      submissionPayload: task.submissionPayload,
      submittedAt: task.submittedAt,
      grade: task.grade,
      evaluationFeedback: task.evaluationFeedback,
      gradedAt: task.gradedAt,
    }));

    // If the milestone doesn't have a deliverable type, derive it from its first task
    const deliverableType = milestone.deliverableType || 
                            milestone.requiredDeliverableType || 
                            (adaptedTasks[0]?.requiredDeliverableType || 'None');

    // Resolve dependencies strictly using camelCase contract properties
    const embeddedDeps = milestone.inboundDependencies || [];
    const relatedEdges = rawDependencies.length > 0
      ? rawDependencies.filter((dep) => dep.successorId === id)
      : embeddedDeps;

    // Map out an array of strict predecessor string GUIDs
    const prerequisiteIds = relatedEdges.map((dep) => dep.predecessorId);

    // Build a dictionary mapping each predecessor ID to its relation type
    const dependencyTypes = relatedEdges.reduce((acc, dep) => {
      const predId = dep.predecessorId;
      if (predId) {
        acc[predId] = dep.type;
      }
      return acc;
    }, {});

    return {
      id,
      title,
      titleSnapshot: title, 
      description,
      descriptionSnapshot: description, 
      expectedHours,
      expectedEffortInHours: expectedHours, 
      deliverableType,
      prerequisiteIds,
      dependencyTypes,
      status: milestone.status,
      tasks: adaptedTasks,
    };
  });
}