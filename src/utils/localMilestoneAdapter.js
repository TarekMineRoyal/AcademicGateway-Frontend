import { DependencyType } from '../constants/enums';

/**
 * Normalizes live backend runtime project instance milestones (LocalMilestones) 
 * and their respective historical tasks (LocalTasks).
 */
export function adaptLocalMilestones(rawMilestones = [], rawDependencies = []) {
  return rawMilestones.map((milestone) => {
    const id = milestone.id;
    
    // Explicitly mapping the live local runtime schema parameters
    const title = milestone.titleSnapshot || 'Untitled Local Milestone';
    const description = milestone.descriptionSnapshot || '';
    const expectedHours = milestone.expectedEffortInHours || 0;
    const status = milestone.status;
    const dueDate = milestone.scheduledEndDate; 
    
    const embeddedDeps = milestone.inboundDependencies || [];
    const relatedEdges = rawDependencies.length > 0
      ? rawDependencies.filter((dep) => dep.successorId === id)
      : embeddedDeps;

    const prerequisiteIds = relatedEdges.map((dep) => dep.predecessorId);
    
    const dependencyTypes = relatedEdges.reduce((acc, dep) => {
      const predId = dep.predecessorId;
      if (predId) {
        acc[predId] = dep.type;
      }
      return acc;
    }, {});

    const rawTasks = milestone.tasks || [];
    const adaptedTasks = rawTasks.map((task) => ({
      id: task.id,
      title: task.titleSnapshot || 'Untitled Local Task',
      description: task.descriptionSnapshot || '',
      weight: task.weight || 0,
      requiredDeliverableType: task.requiredDeliverableType || 'None',
      status: task.status,
      submissionPayload: task.submissionPayload,
      submittedAt: task.submittedAt,
      grade: task.grade,
      evaluationFeedback: task.evaluationFeedback,
      gradedAt: task.gradedAt,
    }));

    // Derive deliverable type context directly from local tasks list
    const deliverableType = milestone.deliverableType || 
                            milestone.requiredDeliverableType || 
                            (adaptedTasks[0]?.requiredDeliverableType || 'None');

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
      status,
      dueDate,
      tasks: adaptedTasks,
    };
  });
}