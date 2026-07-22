import React from 'react';
import { 
  User, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Users, 
  Eye, 
  Check,
  Mail
} from 'lucide-react';

/**
 * Interactive Advisor Card for AI-recommended faculty supervisors.
 * 
 * @param {Object} props
 * @param {Object} props.professor - Recommended professor data object.
 * @param {number} props.rankIndex - Zero-based match index position.
 * @param {boolean} [props.isSelected=false] - Whether this advisor is currently selected.
 * @param {Function} props.onSelect - Callback when student selects this advisor.
 * @param {Function} props.onViewProfile - Callback when student clicks "View Profile".
 */
export function AdvisorCard({ 
  professor, 
  rankIndex, 
  isSelected = false, 
  onSelect, 
  onViewProfile 
}) {
  if (!professor) return null;

  const {
    id,
    fullName,
    email,
    department,
    researchInterests = [],
    currentProjectCount,
    maxSupervisionCapacity,
    isAcceptingProjects = true
  } = professor;

  const isFull = !isAcceptingProjects || (
    maxSupervisionCapacity !== undefined && 
    currentProjectCount !== undefined && 
    Number(currentProjectCount) >= Number(maxSupervisionCapacity)
  );

  const displayedInterests = researchInterests.slice(0, 3);
  const hiddenCount = researchInterests.length - displayedInterests.length;

  return (
    <div 
      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
        isSelected
          ? 'bg-indigo-50/90 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
          : isFull
          ? 'bg-slate-50 border-slate-200 opacity-60'
          : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
      }`}
    >
      {/* Top Row: Avatar, Name, Rank Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
            isSelected 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-700'
          }`}>
            {fullName?.charAt(0) || <User size={18} />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {fullName}
              </h4>
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                <Sparkles size={10} className="text-indigo-600" />
                #{rankIndex + 1} Match
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 truncate">
              {department && (
                <span className="flex items-center gap-1 truncate">
                  <Building2 size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate">{department}</span>
                </span>
              )}
              {email && (
                <span className="flex items-center gap-1 truncate">
                  <Mail size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Research Interests & Capacity */}
      <div className="space-y-2 pt-1 border-t border-slate-100/80">
        {/* Research Interest Pills */}
        {displayedInterests.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <GraduationCap size={12} /> Research:
            </span>
            {displayedInterests.map((interest, idx) => (
              <span 
                key={idx}
                className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md border border-slate-200/60"
              >
                {interest}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded-md">
                +{hiddenCount} more
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No research interests specified.</p>
        )}

        {/* Capacity Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
          <span className="flex items-center gap-1 font-medium">
            <Users size={13} className="text-slate-400" />
            Supervision Capacity:
          </span>
          <span className={`font-bold ${isFull ? 'text-amber-700' : 'text-emerald-700'}`}>
            {currentProjectCount ?? 0} / {maxSupervisionCapacity ?? 'N/A'} slots
            {isFull ? ' (Full)' : ''}
          </span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onViewProfile && onViewProfile(professor)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
        >
          <Eye size={14} />
          View Profile
        </button>

        <button
          type="button"
          onClick={() => !isFull && onSelect && onSelect(professor)}
          disabled={isFull}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            isSelected
              ? 'bg-indigo-600 text-white shadow-xs'
              : isFull
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-white hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-300 hover:border-indigo-600'
          }`}
        >
          {isSelected ? (
            <>
              <Check size={14} /> Selected
            </>
          ) : isFull ? (
            'Capacity Full'
          ) : (
            'Select Advisor'
          )}
        </button>
      </div>
    </div>
  );
}