import PropTypes from 'prop-types';
import { Sparkles } from 'lucide-react';

/**
 * Component to present AI-recommended skills and track selection status.
 */
export default function RecommendedSkillsGroup({
  recommendedSkills = [],
  selectedSkillIds = [],
  isLoading = false,
}) {
  return (
    <div className="pt-4 border-t border-slate-100">
      <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 uppercase tracking-wider mb-2.5">
        <Sparkles size={14} className="text-indigo-600" />
        Recommended Skills for Growth
      </div>

      {isLoading && (
        <div className="text-xs text-slate-400 animate-pulse font-medium">
          Calculating adjacent skill growth recommendations...
        </div>
      )}

      {!isLoading && recommendedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recommendedSkills.map((sk) => {
            const isAlreadyAdded = selectedSkillIds.includes(sk.id);
            return (
              <span
                key={sk.id}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1 transition-colors ${
                  isAlreadyAdded
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-indigo-50/70 text-indigo-800 border-indigo-200/80'
                }`}
              >
                {sk.name}
                {isAlreadyAdded && (
                  <span className="text-[10px] font-extrabold uppercase">(Added)</span>
                )}
              </span>
            );
          })}
        </div>
      )}

      {!isLoading && recommendedSkills.length === 0 && (
        <p className="text-xs text-slate-400 italic">
          Your skill profile is up to date!
        </p>
      )}
    </div>
  );
}

RecommendedSkillsGroup.propTypes = {
  recommendedSkills: PropTypes.array,
  selectedSkillIds: PropTypes.array,
  isLoading: PropTypes.bool,
};