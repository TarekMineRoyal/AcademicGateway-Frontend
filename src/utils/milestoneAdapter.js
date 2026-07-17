/**
 * Normalizes backend blueprint payloads into a strict client-side data contract.
 * Aggregates separate or embedded dependency edge arrays directly into the milestone nodes.
 * Enforces strict camelCase contract compliance with zero defensive property-guessing cascades.
 */
export function adaptMilestones(rawMilestones = [], rawDependencies = []) {
  return rawMilestones.map((milestone) => {
    const id = milestone.id;
    const title = milestone.titleSnapshot;
    const description = milestone.descriptionSnapshot;
    const expectedHours = milestone.expectedEffortInHours;
    const deliverableType = milestone.requiredDeliverableType;

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

    // Task mapping with strict contract property enforcement
    const rawTasks = milestone.tasks || [];
    const adaptedTasks = rawTasks.map((task) => ({
      id: task.id,
      title: task.titleSnapshot,
      description: task.descriptionSnapshot,
      weight: task.weight,
      requiredDeliverableType: task.requiredDeliverableType,
      status: task.status,
      submissionPayload: task.submissionPayload,
      submittedAt: task.submittedAt,
      grade: task.grade,
      evaluationFeedback: task.evaluationFeedback,
      gradedAt: task.gradedAt,
    }));

    return {
      id,
      title,
      titleSnapshot: title, // Preserves baseline context for down-stream rendering logic
      description,
      descriptionSnapshot: description, // Preserves baseline context for down-stream rendering logic
      expectedHours,
      expectedEffortInHours: expectedHours, // Supports downstream telemetry metrics view blocks
      deliverableType,
      prerequisiteIds,
      dependencyTypes,
      status: milestone.status,
      tasks: adaptedTasks,
    };
  });
}