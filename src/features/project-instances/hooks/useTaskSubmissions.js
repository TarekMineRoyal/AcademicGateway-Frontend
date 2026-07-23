import { useState, useCallback } from 'react';
import { useSubmitTaskDeliverable } from './useSubmitTaskDeliverable';

/**
 * Custom hook to encapsulate task deliverable state management (payloads, edit modes)
 * and deliverable submission mutations.
 *
 * @param {Object} params
 * @param {string} params.projectInstanceId - Unique GUID for the running project instance.
 * @param {Object} params.milestone - Active milestone object containing milestone id.
 * @param {Function} [params.showToast] - Callback function to display toast notifications.
 */
export function useTaskSubmissions({ projectInstanceId, milestone, showToast }) {
  const [submissionPayloads, setSubmissionPayloads] = useState({});
  const [editingTasks, setEditingTasks] = useState({});

  const submitTaskMutation = useSubmitTaskDeliverable(projectInstanceId);

  const handlePayloadChange = useCallback((taskId, value) => {
    setSubmissionPayloads((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  }, []);

  const handleStartEditTask = useCallback((task) => {
    setEditingTasks((prev) => ({ ...prev, [task.id]: true }));
    setSubmissionPayloads((prev) => ({ ...prev, [task.id]: task.submittedUrl || '' }));
  }, []);

  const handleCancelEditTask = useCallback((taskId) => {
    setEditingTasks((prev) => ({ ...prev, [taskId]: false }));
  }, []);

  const handleTaskSubmit = useCallback((taskId) => {
    const textValue = (submissionPayloads[taskId] || '').trim();
    if (!textValue) {
      if (showToast) {
        showToast({ type: 'error', text: 'Please provide a valid submission URL.' });
      }
      return;
    }

    submitTaskMutation.mutate(
      {
        milestoneId: milestone?.id,
        taskId,
        submissionPayload: textValue,
      },
      {
        onSuccess: () => {
          if (showToast) {
            showToast({ type: 'success', text: 'Task submitted successfully! Roadmaps updated.' });
          }
          setSubmissionPayloads((prev) => {
            const next = { ...prev };
            delete next[taskId];
            return next;
          });
          setEditingTasks((prev) => ({ ...prev, [taskId]: false }));
        },
        onError: () => {
          if (showToast) {
            showToast({ type: 'error', text: 'Failed to submit deliverable. Please try again.' });
          }
        },
      }
    );
  }, [submissionPayloads, submitTaskMutation, milestone?.id, showToast]);

  const isTaskSubmitting = useCallback(
    (taskId) => submitTaskMutation.isPending && submitTaskMutation.variables?.taskId === taskId,
    [submitTaskMutation.isPending, submitTaskMutation.variables?.taskId]
  );

  return {
    submissionPayloads,
    editingTasks,
    handlePayloadChange,
    handleStartEditTask,
    handleCancelEditTask,
    handleTaskSubmit,
    isTaskSubmitting,
  };
}