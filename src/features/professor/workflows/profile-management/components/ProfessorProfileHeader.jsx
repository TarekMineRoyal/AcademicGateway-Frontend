import { User, Building2, Mail, Users, Pencil } from 'lucide-react';
import { isProfessorFull } from '../../../utils/capacityUtils';

/**
 * Header card component displaying key faculty profile metadata and edit action button.
 * 
 * @param {Object} props
 * @param {Object} props.profile - The professor profile object.
 * @param {boolean} [props.isEditing=false] - Controls display of edit mode state.
 * @param {Function} [props.onEditClick] - Callback to switch into edit mode.
 */
export function ProfessorProfileHeader({ profile, isEditing = false, onEditClick }) {
  if (!profile) return null;

  const {
    fullName,
    rank,
    department,
    email,
    currentProjectCount,
    maxSupervisionCapacity,
  } = profile;

  const isFull = isProfessorFull(profile);

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-4 min-w-0">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0">
          {fullName?.charAt(0) || <User size={28} />}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              {fullName || 'Faculty Member'}
            </h1>
            {rank && (
              <span className="inline-block text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
                {rank}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            {department && (
              <span className="flex items-center gap-1">
                <Building2 size={14} className="text-slate-400" />
                {department}
              </span>
            )}
            {email && (
              <span className="flex items-center gap-1">
                <Mail size={14} className="text-slate-400" />
                <a href={`mailto:${email}`} className="hover:underline text-slate-600">
                  {email}
                </a>
              </span>
            )}
          </div>

          {/* Supervision Capacity Tag */}
          <div className="flex items-center gap-1.5 text-xs font-semibold mt-2">
            <Users size={14} className="text-slate-400" />
            <span className="text-slate-600">Capacity:</span>
            <span className={`font-bold ${isFull ? 'text-amber-700' : 'text-emerald-700'}`}>
              {currentProjectCount ?? 0} / {maxSupervisionCapacity ?? 'N/A'} Slots
              {isFull ? ' (Full)' : ' (Accepting Supervisees)'}
            </span>
          </div>
        </div>
      </div>

      {!isEditing && onEditClick && (
        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Pencil size={14} />
          Edit Profile
        </button>
      )}
    </div>
  );
}

export default ProfessorProfileHeader;