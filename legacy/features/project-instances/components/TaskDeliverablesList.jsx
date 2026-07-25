import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ExternalLink, 
  Award 
} from 'lucide-react';

/**
 * TaskDeliverablesList
 * Isolate task state rendering (PENDING, SUBMITTED, GRADED) and deliverable form submissions.
 */
export default function TaskDeliverablesList({
  tasks = [],
  submissionPayloads = {},
  editingTasks = {},
  getTaskStatusString,
  isTaskSubmitting,
  handlePayloadChange,
  handleStartEditTask,
  handleCancelEditTask,
  handleTaskSubmit,
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-400">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
        <p className="text-xs">No tasks mapped to this milestone.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {tasks.map((task) => {
        const status = getTaskStatusString(task.status);
        const isEditingThisTask = editingTasks[task.id];

        return (
          <div 
            key={task.id} 
            className="border border-neutral-200 rounded-xl bg-white p-4 shadow-2xs hover:shadow-xs transition-shadow"
          >
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div>
                <h4 className="text-xs font-bold text-neutral-800 leading-tight">
                  {task.title}
                </h4>
                <span className="text-[10px] text-neutral-400 mt-0.5 inline-block">
                  Weight: <span className="font-semibold text-neutral-600">{task.weight}%</span>
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

            {/* Description */}
            <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
              {task.description}
            </p>

            {/* STATE 1: PENDING FORM DISPLAY OR ACTIVE SUBMITTED EDIT MODE PANEL */}
            {(status === 'PENDING' || isEditingThisTask) && (
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Paste Git Repo or Deliverable URL..."
                    value={
                      submissionPayloads[task.id] !== undefined 
                        ? submissionPayloads[task.id] 
                        : (task.submittedUrl || '')
                    }
                    onChange={(e) => handlePayloadChange(task.id, e.target.value)}
                    disabled={isTaskSubmitting(task.id)}
                    className="flex-1 text-xs border border-neutral-200 rounded-lg px-2.5 py-2 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-neutral-50 disabled:text-neutral-400"
                  />
                  <button
                    onClick={() => handleTaskSubmit(task.id)}
                    disabled={isTaskSubmitting(task.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed shrink-0"
                  >
                    {isTaskSubmitting(task.id) ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
                {isEditingThisTask && (
                  <button
                    type="button"
                    onClick={() => handleCancelEditTask(task.id)}
                    disabled={isTaskSubmitting(task.id)}
                    className="text-left text-[10px] text-neutral-400 hover:text-neutral-600 font-semibold w-fit transition-colors cursor-pointer"
                  >
                    Cancel Modification
                  </button>
                )}
              </div>
            )}

            {/* STATE 2: SUBMITTED RENDERING (WITH ACTIVE RE-SUBMIT OPEN TRIGGER) */}
            {status === 'SUBMITTED' && !isEditingThisTask && task.submittedUrl && (
              <div className="mt-2.5 p-2.5 px-3 bg-neutral-50 border border-neutral-100 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-neutral-400 shrink-0">Payload:</span>
                  <a 
                     href={task.submittedUrl} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline truncate"
                  >
                    View Link
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleStartEditTask(task)}
                  className="text-indigo-600 hover:text-indigo-800 font-bold text-xs cursor-pointer transition-colors shrink-0 ml-3"
                >
                  Edit Link
                </button>
              </div>
            )}

            {/* STATE 3: EVALUATION COMPLETED */}
            {status === 'GRADED' && (
              <div className="mt-3.5 space-y-2 border-t border-neutral-100 pt-3">
                {task.submittedUrl && (
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-neutral-400">Submission link:</span>
                    <a 
                       href={task.submittedUrl} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline"
                    >
                      View Link
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                
                <div className="bg-emerald-50/60 border border-emerald-100/70 p-3 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Evaluation Score</span>
                    <div className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      <Award className="w-3.5 h-3.5" />
                      <span>{task.grade} / 100</span>
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
      })}
    </div>
  );
}