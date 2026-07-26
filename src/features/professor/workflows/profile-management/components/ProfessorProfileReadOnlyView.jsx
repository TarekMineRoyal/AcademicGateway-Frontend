import { GraduationCap, BookOpen } from 'lucide-react';
import ProfessorProfileHeader from './ProfessorProfileHeader';

/**
 * Read-only layout displaying the professor's academic profile and research interests.
 * 
 * @param {Object} props
 * @param {Object} props.profile - The professor profile data object.
 * @param {Function} props.onEditClick - Callback to toggle form into edit mode.
 */
export function ProfessorProfileReadOnlyView({ profile, onEditClick }) {
  if (!profile) return null;

  const { researchInterests = [], aboutMe } = profile;

  return (
    <div>
      {/* Header Banner */}
      <ProfessorProfileHeader profile={profile} onEditClick={onEditClick} />

      <div className="space-y-6">
        {/* Research Interests / Expertise */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <GraduationCap size={15} className="text-primary" />
            Research Interests & Expertise
          </div>
          {researchInterests && researchInterests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {researchInterests.map((topic, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold px-3 py-1 rounded-md"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No research interests specified yet.</p>
          )}
        </div>

        {/* About & Background */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <BookOpen size={15} className="text-primary" />
            About & Academic Background
          </div>
          <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
            {aboutMe || 'No detailed background provided.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfessorProfileReadOnlyView;