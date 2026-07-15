import React from 'react';

/**
 * MilestoneTimeline - Vertical roadmap tree of project milestones.
 * Includes interactive selection, task progress metrics, and dynamic dependency lock logic.
 */
export default function MilestoneTimeline({ milestones, selectedMilestoneId, onSelectMilestone }) {
  
  // Format dates securely to MM/DD/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (e) {
      return 'N/A';
    }
  };

  // Determine colors and animation states based on milestone status
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Completed': 
        return { 
          bg: 'bg-green-500', 
          border: 'border-green-200', 
          text: 'text-green-800 bg-green-50 border-green-200',
          ring: 'ring-green-100'
        };
      case 'Submitted': 
        return { 
          bg: 'bg-amber-500', 
          border: 'border-amber-200', 
          text: 'text-amber-800 bg-amber-50 border-amber-200',
          ring: 'ring-amber-100'
        };
      case 'InProgress': 
        return { 
          bg: 'bg-blue-600 animate-pulse', 
          border: 'border-blue-200', 
          text: 'text-blue-800 bg-blue-50 border-blue-200',
          ring: 'ring-blue-100'
        };
      default: 
        return { 
          bg: 'bg-gray-300', 
          border: 'border-gray-100', 
          text: 'text-gray-600 bg-gray-50 border-gray-100',
          ring: 'ring-gray-100'
        };
    }
  };

  if (!milestones || milestones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-500">No milestones available for this project template.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-gray-200 ml-6 pl-8 space-y-8 py-4">
      {milestones.map((milestone) => {
        const isSelected = milestone.id === selectedMilestoneId;
        const statusConfig = getStatusConfig(milestone.status);

        // Predecessor lookup and lock status determination
        const predecessorIds = milestone.inboundDependencies || [];
        const predecessorsData = predecessorIds.map(predId => {
          // Robust checking if predecessor identifier is an object or pure ID
          const targetId = typeof predId === 'object' && predId !== null ? predId.id || predId.predecessorId : predId;
          const matchedMilestone = milestones.find(m => m.id === targetId);
          return {
            title: matchedMilestone ? matchedMilestone.titleSnapshot : 'Prerequisite',
            isCompleted: matchedMilestone ? matchedMilestone.status === 'Completed' : false
          };
        });

        // Determine if milestone is locked by looking for any non-completed dependency
        const isBlocked = predecessorsData.some(p => !p.isCompleted);

        // Progress metrics calculation
        const tasks = milestone.tasks || [];
        const completedTasksCount = tasks.filter(t => t.status === 'Graded' || t.status === 'Completed').length;
        const totalTasksCount = tasks.length;

        return (
          <div 
            key={milestone.id} 
            onClick={() => onSelectMilestone(milestone.id)}
            className={`relative p-5 border rounded-xl cursor-pointer transition-all duration-200 ${
              isSelected 
                ? 'border-blue-500 bg-blue-50/10 ring-2 ring-blue-100 shadow-md transform -translate-y-0.5' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            {/* Timeline status dot placement - Centered perfectly on the border line via -left-[41px] (pl-8 offset) */}
            <div className={`absolute -left-[41px] top-6 w-4 h-4 rounded-full ring-4 ring-white flex items-center justify-center shadow-sm ${statusConfig.bg}`}>
              {milestone.status === 'Completed' && (
                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            {/* Dependency Banner Grid */}
            {predecessorsData.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {predecessorsData.map((pred, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border ${
                      pred.isCompleted 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                        : 'text-amber-700 bg-amber-50 border-amber-200'
                    }`}
                  >
                    <span>{pred.isCompleted ? '🔗' : '🔒'}</span>
                    <span>
                      {pred.isCompleted ? 'Prerequisite' : 'Requires'}: {pred.title} {pred.isCompleted ? '(Completed)' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Title & Status Badge */}
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-bold text-gray-900 leading-snug">{milestone.titleSnapshot}</h3>
                {/* Timeline window presentation */}
                <p className="text-xs text-gray-400 mt-0.5">
                  Window: {formatDate(milestone.startDate || milestone.StartDate)} - {formatDate(milestone.endDate || milestone.EndDate)}
                </p>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border shrink-0 ${statusConfig.text}`}>
                {milestone.status}
              </span>
            </div>
            
            {/* Description Snapshot */}
            <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
              {milestone.descriptionSnapshot}
            </p>

            {/* Telemetry and Progress Grid */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-gray-500 border-t pt-3">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">Effort</span>
                <span className="font-bold text-gray-800 text-sm">
                  {milestone.expectedEffortInHours || 0} hrs
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">WBS Weight</span>
                <span className="font-bold text-gray-800 text-sm">
                  {milestone.wbsWeight || 0}%
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">Progress</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-bold mt-0.5 ${
                  completedTasksCount === totalTasksCount && totalTasksCount > 0
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-blue-700 bg-blue-50'
                }`}>
                  Tasks: {completedTasksCount}/{totalTasksCount} Done
                </span>
              </div>
            </div>

            {/* Sequentially Blocked Visual Cover Overlay */}
            {isBlocked && (
              <div className="absolute inset-0 bg-gray-50/20 backdrop-blur-[0.5px] rounded-xl pointer-events-none border border-dashed border-amber-200/50" />
            )}
          </div>
        );
      })}
    </div>
  );
}