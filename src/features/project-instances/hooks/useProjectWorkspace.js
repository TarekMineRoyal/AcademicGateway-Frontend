import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectDetails, getProjectMilestones } from '../projectInstancesApi';
import { adaptLocalMilestones } from '../../../shared/utils/localMilestoneAdapter';
import { usePostMilestoneComment } from './usePostMilestoneComment';
import { useSubmitTaskDeliverable } from './useSubmitTaskDeliverable';

/**
 * Custom hook managing the entire state machine and data interaction layer for Project Workspace.
 *
 * @param {string} projectInstanceId - The unique tracking GUID for the running instance.
 */
export function useProjectWorkspace(projectInstanceId) {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);

  // 1. Server Data Queries
  const projectQuery = useQuery({
    queryKey: ['projectInstance', projectInstanceId],
    queryFn: () => getProjectDetails(projectInstanceId),
    enabled: !!projectInstanceId,
  });

  const milestonesQuery = useQuery({
    queryKey: ['projectMilestones', projectInstanceId],
    queryFn: () => getProjectMilestones(projectInstanceId),
    enabled: !!projectInstanceId,
  });

  // 2. Mutation Hooks
  const postCommentMutation = usePostMilestoneComment(projectInstanceId);
  const submitDeliverableMutation = useSubmitTaskDeliverable(projectInstanceId);

  // 3. Safe Runtime Processing using local contracts mapping execution data parameters
  const adaptedMilestones = (projectQuery.data && milestonesQuery.data)
    ? adaptLocalMilestones(milestonesQuery.data, projectQuery.data.dependencies || [])
    : [];

  // 4. Derive active milestone selection dynamically without triggering cascading renders
  const defaultMilestoneId = adaptedMilestones.length > 0
    ? (adaptedMilestones.find(m => m.status === 'InProgress')?.id 
      || adaptedMilestones.find(m => m.status !== 'Completed')?.id 
      || adaptedMilestones[0]?.id)
    : null;

  const activeSelectedMilestoneId = selectedMilestoneId ?? defaultMilestoneId;
  const selectedMilestone = adaptedMilestones.find(m => m.id === activeSelectedMilestoneId);

  return {
    // Data
    project: projectQuery.data,
    milestones: adaptedMilestones,
    selectedMilestone,
    selectedMilestoneId: activeSelectedMilestoneId,
    
    // Statuses
    isLoading: projectQuery.isLoading || milestonesQuery.isLoading,
    error: projectQuery.error || milestonesQuery.error,

    // Selection Handlers
    setSelectedMilestoneId,

    // Comment Submission
    postComment: postCommentMutation.mutateAsync,
    isPostingComment: postCommentMutation.isPending,
    postCommentError: postCommentMutation.error,

    // Deliverable Submission
    submitDeliverable: submitDeliverableMutation.mutateAsync,
    isSubmittingDeliverable: submitDeliverableMutation.isPending,
    submitDeliverableError: submitDeliverableMutation.error,
  };
}