import { useMilestoneActionCenter } from '../hooks/useMilestoneActionCenter';
import TaskDeliverablesList from './TaskDeliverablesList';
import DiscussionFeed from './DiscussionFeed';
import { 
  BookOpen, 
  FileText, 
  MessageSquare, 
  AlertCircle, 
  Check 
} from 'lucide-react';

/**
 * MilestoneActionCenter
 * Clean presentation wrapper orchestrating sub-views and delegating state management
 * entirely to useMilestoneActionCenter().
 */
export default function MilestoneActionCenter({ projectInstanceId, milestone, project }) {
  const {
    activeTab,
    commentInput,
    submissionPayloads,
    editingTasks,
    toast,
    chatEndRef,
    comments,
    loadingComments,
    isPostingComment,
    setActiveTab,
    setCommentInput,
    handlePayloadChange,
    handleStartEditTask,
    handleCancelEditTask,
    handleTaskSubmit,
    handleSendMessage,
    handleKeyDown,
    getAuthorName,
    getAuthorIdentity,
    formatCommentTime,
    getTaskStatusString,
    isTaskSubmitting,
  } = useMilestoneActionCenter({ projectInstanceId, milestone, project });

  // Fallback structural rendering for Empty State
  if (!milestone) {
    return (
      <div className="flex flex-col items-center justify-center h-[520px] border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50 p-8 text-center">
        <div className="p-3 bg-neutral-100 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-base font-bold text-neutral-800">No Milestone Selected</h3>
        <p className="text-sm text-neutral-500 max-w-xs mt-2">
          Select an active node from the roadmap to review task lists, submit deliverables, and communicate with your supervisor.
        </p>
      </div>
    );
  }

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

      {/* Header */}
      <div className="p-4 border-b border-neutral-100 bg-linear-to-b from-neutral-50/50 to-white">
        <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">Active Milestone</span>
        <h2 className="text-base font-bold text-neutral-800 truncate mt-0.5" title={milestone.title}>
          {milestone.title}
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
          <TaskDeliverablesList
            tasks={milestone.tasks || []}
            submissionPayloads={submissionPayloads}
            editingTasks={editingTasks}
            getTaskStatusString={getTaskStatusString}
            isTaskSubmitting={isTaskSubmitting}
            handlePayloadChange={handlePayloadChange}
            handleStartEditTask={handleStartEditTask}
            handleCancelEditTask={handleCancelEditTask}
            handleTaskSubmit={handleTaskSubmit}
          />
        )}

        {/* DISCUSSION FEED TAB */}
        {activeTab === 'feed' && (
          <DiscussionFeed
            comments={comments}
            loadingComments={loadingComments}
            project={project}
            getAuthorName={getAuthorName}
            getAuthorIdentity={getAuthorIdentity}
            formatCommentTime={formatCommentTime}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            handleKeyDown={handleKeyDown}
            handleSendMessage={handleSendMessage}
            isPostingComment={isPostingComment}
            chatEndRef={chatEndRef}
          />
        )}

      </div>
    </div>
  );
}