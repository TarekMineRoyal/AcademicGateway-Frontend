import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMilestoneComments } from '../projectInstancesApi';
import { usePostMilestoneComment } from './usePostMilestoneComment';
import { LocalTaskStatus } from '../../../shared/constants/enums';
import { useToast } from '../../../shared/hooks/useToast';
import { useScrollToView } from '../../../shared/hooks/useScrollToView';
import { useTaskSubmissions } from './useTaskSubmissions';

/**
 * Orchestration hook to coordinate local tab state, comments feed,
 * and extracted task submission, toast notification, and scroll sub-hooks.
 *
 * @param {string} projectInstanceId - Unique GUID for the running project instance.
 * @param {Object} milestone - Current active milestone data object.
 * @param {Object} project - Project details object containing student/supervisor identities.
 */
export function useMilestoneActionCenter({ projectInstanceId, milestone, project }) {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'feed'
  const [commentInput, setCommentInput] = useState('');

  // 1. Toast Notification Sub-Hook
  const { toast, showToast } = useToast();

  // 2. Task Submissions & Deliverables Sub-Hook
  const {
    submissionPayloads,
    editingTasks,
    handlePayloadChange,
    handleStartEditTask,
    handleCancelEditTask,
    handleTaskSubmit,
    isTaskSubmitting,
  } = useTaskSubmissions({
    projectInstanceId,
    milestone,
    showToast,
  });

  // 3. Comments Server-State Isolation
  const { data: comments = [], isLoading: loadingComments } = useQuery({
    queryKey: ['milestoneComments', projectInstanceId, milestone?.id],
    queryFn: () => getMilestoneComments(projectInstanceId, milestone.id),
    enabled: !!milestone?.id && activeTab === 'feed',
  });

  const postCommentMutation = usePostMilestoneComment(projectInstanceId);

  // 4. DOM Side-Effect Abstraction (Scroll to chat feed end)
  const chatEndRef = useScrollToView([comments, activeTab], activeTab === 'feed');

  // Helper Strategies
  const getAuthorName = (comment) => {
    if (!project) return comment.authorIdentitySnapshot;
    if (comment.authorId === project.studentId) {
      return project.studentName;
    }
    if (comment.authorId === project.supervisorId) {
      return project.supervisorName;
    }
    return comment.authorIdentitySnapshot;
  };

  const getAuthorIdentity = (comment) => {
    if (comment.authorId === project?.studentId) {
      return 'Student Developer';
    }
    if (comment.authorId === project?.supervisorId) {
      return 'Faculty Advisor';
    }
    return comment.authorIdentitySnapshot;
  };

  const formatCommentTime = (comment) => {
    const dateObj = new Date(comment.createdAt);
    if (isNaN(dateObj.getTime())) {
      return 'Just now';
    }
    return dateObj.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTaskStatusString = (statusValue) => {
    switch (statusValue) {
      case LocalTaskStatus.NOT_STARTED:
        return 'PENDING';
      case LocalTaskStatus.SUBMITTED:
        return 'SUBMITTED';
      case LocalTaskStatus.GRADED:
        return 'GRADED';
      default:
        return String(statusValue).toUpperCase();
    }
  };

  // Discussion Feed Actions
  const handleSendMessage = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!commentInput.trim() || postCommentMutation.isPending) return;
    postCommentMutation.mutate({
      milestoneId: milestone.id,
      content: commentInput.trim()
    }, {
      onSuccess: () => {
        setCommentInput('');
      },
      onError: () => {
        showToast({ type: 'error', text: 'Message failed to send. Please check your connection.' });
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return {
    // Reactive State
    activeTab,
    commentInput,
    submissionPayloads,
    editingTasks,
    toast,
    chatEndRef,

    // Server State & Queries
    comments,
    loadingComments,
    isPostingComment: postCommentMutation.isPending,

    // Action Handlers
    setActiveTab,
    setCommentInput,
    handlePayloadChange,
    handleStartEditTask,
    handleCancelEditTask,
    handleTaskSubmit,
    handleSendMessage,
    handleKeyDown,

    // Helper Functions
    getAuthorName,
    getAuthorIdentity,
    formatCommentTime,
    getTaskStatusString,
    isTaskSubmitting,
  };
}