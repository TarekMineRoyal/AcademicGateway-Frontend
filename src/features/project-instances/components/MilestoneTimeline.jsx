import { LocalMilestoneStatus } from '../../../shared/constants/enums';

// Simple presentation utility—no inline try/catch blocks needed as dates are guaranteed valid ISO strings
const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function MilestoneTimeline({ milestones, selectedId, onSelect }) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-500">No milestones available for this project template.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Project Roadmap</h2>
        <p className="text-gray-500 text-sm mt-0.5">Track sequential task dependencies and deliverables</p>
      </div>

      <div className="relative border-l-2 border-gray-100 pl-6 ml-3 space-y-8">
        {milestones.map((milestone) => {
          // Zero runtime type-guessing. Dependencies are strictly flat arrays of IDs.
          const hasUnresolvedDependencies = milestone.dependencyIds?.length > 0;
          const isSelected = milestone.id === selectedId;

          return (
            <div 
              key={milestone.id} 
              onClick={() => onSelect(milestone.id)}
              className={`relative cursor-pointer group transition-all ${isSelected ? 'scale-[1.01]' : ''}`}
            >
              {/* Timeline Indicator Dot linked directly to LocalMilestoneStatus */}
              <span className={`absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-4 bg-white transition-colors ${
                milestone.status === LocalMilestoneStatus.GRADED ? 'border-green-500' :
                milestone.status === LocalMilestoneStatus.SUBMITTED ? 'border-amber-500' :
                milestone.status === LocalMilestoneStatus.IN_PROGRESS ? 'border-blue-500' : 'border-gray-300'
              }`} />

              <div className={`p-4 rounded-xl border transition-all ${
                isSelected 
                  ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    {/* Strict camelCase Destructuring inside the render nodes */}
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {milestone.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Due Target: {formatDate(milestone.dueDate)}
                    </p>
                  </div>

                  {/* Status Badges bound strictly to stable system enum keys */}
                  <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                    milestone.status === LocalMilestoneStatus.GRADED ? 'bg-green-50 text-green-700' :
                    milestone.status === LocalMilestoneStatus.SUBMITTED ? 'bg-amber-50 text-amber-700' :
                    milestone.status === LocalMilestoneStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {milestone.status}
                  </span>
                </div>

                {hasUnresolvedDependencies && (
                  <div className="mt-3 pt-2.5 border-t border-dashed border-gray-100 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Requires completion of upstream prerequisite assignments</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}