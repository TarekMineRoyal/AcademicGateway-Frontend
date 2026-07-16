/**
 * Normalizes backend blueprint payloads into a strict client-side data contract.
 * Aggregates separate or embedded dependency edge arrays directly into the milestone nodes.
 */
export function adaptMilestones(rawMilestones = [], rawDependencies = []) {
  return rawMilestones.map((milestone) => {
    const id = milestone.id || milestone.Id;
    const title = milestone.titleSnapshot || milestone.TitleSnapshot || milestone.title || milestone.Title || '';
    const description = milestone.descriptionSnapshot || milestone.DescriptionSnapshot || milestone.description || milestone.Description || '';
    
    const expectedHours = milestone.expectedEffortInHours !== undefined 
      ? milestone.expectedEffortInHours 
      : (milestone.ExpectedEffortInHours || 0);
      
    const deliverableType = milestone.requiredDeliverableType !== undefined 
      ? milestone.requiredDeliverableType 
      : (milestone.RequiredDeliverableType || 0);

    // --- SELF HEALING DEPENDENCY RESOLUTION ---
    // If global dependencies array is empty (Live Track), extract them from the embedded milestone node
    const embeddedDeps = milestone.inboundDependencies || milestone.InboundDependencies || [];
    const relatedEdges = rawDependencies.length > 0
      ? rawDependencies.filter((dep) => (dep.successorId || dep.SuccessorId) === id)
      : embeddedDeps;

    // Map out an array of strict predecessor string GUIDs
    const prerequisiteIds = relatedEdges.map(
      (dep) => dep.predecessorId || dep.PredecessorId
    );

    // Build a dictionary mapping each predecessor ID to its relation type
    const dependencyTypes = relatedEdges.reduce((acc, dep) => {
      const predId = dep.predecessorId || dep.PredecessorId;
      const type = dep.type !== undefined ? dep.type : dep.Type;
      if (predId) acc[predId] = type;
      return acc;
    }, {});

    // --- TASK MAPPING ---
    const rawTasks = milestone.localTasks || milestone.LocalTasks || 
                     milestone.globalTasks || milestone.GlobalTasks || 
                     milestone.tasks || milestone.Tasks || [];

    const adaptedTasks = rawTasks.map((task) => ({
      id: task.id || task.Id,
      title: task.titleSnapshot || task.TitleSnapshot || task.title || task.Title || '',
      description: task.descriptionSnapshot || task.DescriptionSnapshot || task.description || task.Description || '',
      weight: task.weight !== undefined ? task.weight : (task.Weight || 0),
      requiredDeliverableType: task.requiredDeliverableType !== undefined 
        ? task.requiredDeliverableType 
        : (task.RequiredDeliverableType || 0),
      status: task.status !== undefined ? task.status : task.Status,
      submissionPayload: task.submissionPayload || task.SubmissionPayload || null,
      submittedAt: task.submittedAt || task.SubmittedAt || null,
      grade: task.grade !== undefined ? task.grade : task.Grade,
      evaluationFeedback: task.evaluationFeedback || task.EvaluationFeedback || null,
      gradedAt: task.gradedAt || task.GradedAt || null
    }));

    return {
      id,
      title,
      description,
      expectedHours,
      deliverableType,
      prerequisiteIds,
      dependencyTypes,
      status: milestone.status !== undefined ? milestone.status : milestone.Status,
      tasks: adaptedTasks,
    };
  });
}