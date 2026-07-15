import React, { useState, useEffect, useRef } from 'react';
import { 
  getMilestoneComments, 
  postMilestoneComment, 
  submitTaskDeliverable 
} from '../projectInstancesApi'; //[cite: 1]
import { 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Award, 
  BookOpen, 
  FileText,
  Loader2,
  Check
} from 'lucide-react';

export default function MilestoneActionCenter({ projectInstanceId, milestone, onRefresh }) {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'feed'
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  
  // Maps taskId -> input string for student repository submission
  const [submissionPayloads, setSubmissionPayloads] = useState({}); //[cite: 1]
  const [submittingTasks, setSubmittingTasks] = useState({}); // taskId -> boolean (loading state)
  
  // Custom toast notification system
  const [toast, setToast] = useState(null);

  const chatEndRef = useRef(null);

  // Auto-dismiss toast notification after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Reload comment feed when selected milestone or active tab changes
  useEffect(() => {
    if (milestone && activeTab === 'feed') {
      setLoadingComments(true);
      getMilestoneComments(projectInstanceId, milestone.id) //[cite: 1]
        .then((data) => {
          setComments(data || []);
        })
        .catch((err) => {
          console.error("Error fetching comments:", err);
          setToast({ type: 'error', text: 'Failed to fetch discussion feed history.' });
        })
        .finally(() => {
          setLoadingComments(false);
        });
    }
  }, [projectInstanceId, milestone?.id, activeTab]);

  // Smooth scroll to the latest chat feed message
  useEffect(() => {
    if (activeTab === 'feed' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, activeTab]);

  // Fallback structural rendering for Empty State
  if (!milestone) {
    return (
      <div className="flex flex-col items-center justify-center h-[520px] border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50 p-8 text-center">
        <div className="p-3 bg-neutral-100 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-base font-bold text-neutral-800">No Milestone Selected</h3>
        <p className="text-sm text-neutral-500 max-w-xs mt-2">
          Select an active node from the roadmap to review task lists, submit deliverables, and communicate with your supervisor.[cite: 1]
        </p>
      </div>
    );
  }

  // Handle students submitting URLs/repository links for tasks
  const handleTaskSubmit = async (taskId) => {
    const textValue = (submissionPayloads[taskId] || '').trim();
    if (!textValue) {
      setToast({ type: 'error', text: 'Please provide a valid submission URL.' });
      return;
    }

    setSubmittingTasks((prev) => ({ ...prev, [taskId]: true }));

    try {
      // Robust payload containing alternate property formats to ensure maximum backend schema compatibility
      const payload = { 
        submissionUrl: textValue,
        url: textValue
      };

      await submitTaskDeliverable(projectInstanceId, taskId, payload); //[cite: 1]
      
      setToast({ type: 'success', text: 'Task submitted successfully! Roadmaps updated.' });
      
      // Clear specific input text state
      setSubmissionPayloads((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });

      // Call refresh on parent shell to pull down updated workspace metadata
      if (onRefresh) {
        await onRefresh(); //[cite: 1]
      }
    } catch (err) {
      console.error("Error submitting task:", err);
      setToast({ type: 'error', text: 'Failed to submit deliverable. Please try again.' });
    } finally {
      setSubmittingTasks((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  // Handle post comment submission
  const handleSendComment = async (e) => {
    e.preventDefault();
    const commentText = commentInput.trim();
    if (!commentText || postingComment) return;

    setPostingComment(true);

    try {
      const newComment = await postMilestoneComment(projectInstanceId, milestone.id, commentText); //[cite: 1]
      
      // Append comment instantly to local state list for immediate real-time rendering
      if (newComment) {
        setComments((prev) => [...prev, newComment]); //[cite: 1]
      } else {
        // Safe fallback in case the backend only sends a blank 204 or non-JSON success indicator
        const optimisticComment = {
          id: Date.now().toString(),
          content: commentText,
          authorIdentitySnapshot: 'Student Developer',
          createdAt: new Date().toISOString()
        };
        setComments((prev) => [...prev, optimisticComment]);
      }
      
      setCommentInput(''); //[cite: 1]
    } catch (err) {
      console.error("Error posting comment:", err);
      setToast({ type: 'error', text: 'Could not send comment. Please try again.' });
    } finally {
      setPostingComment(false);
    }
  };

  // Helper date formatter to make chat timestamps look clean and premium
  const formatTimestamp = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[550px] relative">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-lg shadow-md z-50 flex items-center gap-2 text-sm border font-medium animate-bounce ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {toast.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header with selected milestone meta info */}
      <div className="p-4 border-b border-neutral-100 bg-linear-to-b from-neutral-50/50 to-white">
        <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">Active Milestone</span>
        <h2 className="text-base font-bold text-neutral-800 truncate mt-0.5" title={milestone.title}>
          {milestone.title || milestone.name || "Selected Milestone"}
        </h2>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-neutral-100 bg-neutral-50/40 p-1.5 gap-1">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'tasks' 
              ? 'bg-white text-indigo-600 shadow-xs border border-neutral-200/50' 
              : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Tasks & Deliverables
        </button>
        <button 
          onClick={() => setActiveTab('feed')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'feed' 
              ? 'bg-white text-indigo-600 shadow-xs border border-neutral-200/50' 
              : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Discussion Feed
        </button>
      </div>

      {/* Scrollable Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 bg-neutral-50/30">
        
        {/* TASK DELIVERABLES TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-3.5">
            {!milestone.tasks || milestone.tasks.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                <p className="text-xs">No tasks mapped to this milestone.</p>
              </div>
            ) : (
              milestone.tasks.map((task) => {
                // Safeguards against varying backend data field names
                const title = task.title || task.titleSnapshot || task.name || "Untitled Task";
                const description = task.description || task.descriptionSnapshot || "No task description details provided.";
                const weight = task.weight !== undefined ? task.weight : 0;
                const status = (task.status || "Pending").toUpperCase();
                const submittedUrl = task.submittedUrl || task.submissionUrl || task.payload;

                return (
                  <div key={task.id} className="border border-neutral-200 rounded-xl bg-white p-4 shadow-2xs hover:shadow-xs transition-shadow">
                    
                    {/* Header: Title, weight & Status badge */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-800 leading-tight">
                          {title}
                        </h4>
                        <span className="text-[10px] text-neutral-400 mt-0.5 inline-block">
                          Weight: <span className="font-semibold text-neutral-600">{weight}%</span>
                        </span>
                      </div>

                      {/* Status Badging */}
                      {status === 'GRADED' ? (
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Graded
                        </span>
                      ) : status === 'SUBMITTED' ? (
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
                          <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                          Submitted
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-200">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          Pending
                        </span>
                      )}
                    </div>

                    {/* Task Snapshot Description */}
                    <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
                      {description}
                    </p>

                    {/* STATE 1: PENDING SUBMISSION FORM */}
                    {status === 'PENDING' && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                        <input
                          type="url"
                          placeholder="Paste Git Repo or Deliverable URL..."
                          value={submissionPayloads[task.id] || ''}
                          onChange={(e) => setSubmissionPayloads(prev => ({ 
                            ...prev, 
                            [task.id]: e.target.value 
                          }))}
                          disabled={submittingTasks[task.id]}
                          className="flex-1 text-xs border border-neutral-200 rounded-lg px-2.5 py-2 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-neutral-50 disabled:text-neutral-400"
                        />
                        <button
                          onClick={() => handleTaskSubmit(task.id)}
                          disabled={submittingTasks[task.id]}
                          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed shrink-0"
                        >
                          {submittingTasks[task.id] ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            'Submit'
                          )}
                        </button>
                      </div>
                    )}

                    {/* STATE 2: SUBMITTED (AWAITING GRADE) */}
                    {status === 'SUBMITTED' && submittedUrl && (
                      <div className="mt-2.5 p-2 px-3 bg-neutral-50 border border-neutral-100 rounded-lg flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Submission payload:</span>
                        <a 
                          href={submittedUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline"
                        >
                          View Link
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* STATE 3: GRADED / EVALUATION FEEDBACK PANEL */}
                    {status === 'GRADED' && (
                      <div className="mt-3.5 space-y-2 border-t border-neutral-100 pt-3">
                        {submittedUrl && (
                          <div className="flex items-center justify-between text-xs px-1">
                            <span className="text-neutral-400">Submission link:</span>
                            <a 
                              href={submittedUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline"
                            >
                              View Link
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                        
                        {/* Grade Score and Comments container */}
                        <div className="bg-emerald-50/60 border border-emerald-100/70 p-3 rounded-lg space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Evaluation Score</span>
                            <div className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                              <Award className="w-3.5 h-3.5" />
                              <span>{task.grade !== undefined ? task.grade : '0'} / 100</span>
                            </div>
                          </div>
                          {task.evaluationFeedback && (
                            <div className="text-xs text-neutral-600 leading-relaxed pt-1 border-t border-emerald-100/50">
                              <span className="font-semibold text-emerald-900">Feedback: </span>
                              {task.evaluationFeedback}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* DISCUSSION FEED TAB */}
        {activeTab === 'feed' && (
          <div className="flex flex-col h-full">
            
            {/* Scrollable messages box */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 min-h-[340px] max-h-[340px]">
              {loadingComments ? (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                  <Loader2 className="w-7 h-7 animate-spin text-neutral-300 mb-2" />
                  <p className="text-xs">Loading correspondence history...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400">
                  <MessageSquare className="w-8 h-8 text-neutral-300 mb-2" />
                  <p className="text-xs font-semibold">No activity logs yet</p>
                  <p className="text-[11px] max-w-xs mt-1 px-4 text-neutral-400">
                    Be the first to leave a status update, ask a question, or contact the supervisors.
                  </p>
                </div>
              ) : (
                comments.map((comment) => {
                  const isStudent = (comment.authorIdentitySnapshot || '').toLowerCase().includes('student');
                  
                  return (
                    <div 
                      key={comment.id} 
                      className={`flex flex-col max-w-[85%] ${
                        isStudent ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      {/* Meta information tags */}
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-neutral-400">
                        <span className="font-bold text-neutral-500">
                          {comment.authorName || (isStudent ? 'You' : 'Supervisor')}
                        </span>
                        <span>•</span>
                        <span className="italic text-neutral-400 bg-neutral-100 px-1 rounded-sm">
                          {comment.authorIdentitySnapshot || 'User'}
                        </span>
                      </div>

                      {/* Styled comment text bubble */}
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isStudent 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none shadow-3xs'
                      }`}>
                        <p className="whitespace-pre-wrap">{comment.content}</p>
                      </div>

                      {/* Display Timestamp */}
                      <span className="text-[9px] text-neutral-400 mt-1 px-1">
                        {formatTimestamp(comment.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
              {/* Reference Anchor for scroll pinning */}
              <div ref={chatEndRef} />
            </div>

            {/* Comment Post Footer form box */}
            <form onSubmit={handleSendComment} className="border-t border-neutral-100 pt-3.5 bg-white flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Type a message to supervisors..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={postingComment}
                className="flex-1 text-xs border border-neutral-200 rounded-xl px-3 py-2.5 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-neutral-50 disabled:text-neutral-400"
              />
              <button
                type="submit"
                disabled={!commentInput.trim() || postingComment}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-200 disabled:hover:bg-neutral-200 text-white disabled:text-neutral-400 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                {postingComment ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}