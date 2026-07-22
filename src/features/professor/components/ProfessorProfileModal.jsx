import React from 'react';
import { useProfessorProfile } from '../hooks/useProfessorProfile';
import { 
  X, 
  User, 
  Mail, 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Check, 
  AlertCircle 
} from 'lucide-react';

/**
 * Detailed profile modal displaying comprehensive information about a faculty advisor.
 * 
 * @param {Object} props
 * @param {string|null} props.professorId - ID of the professor whose profile to render.
 * @param {boolean} props.isOpen - Controls modal visibility.
 * @param {Function} props.onClose - Callback triggered to dismiss the modal.
 * @param {Function} props.onSelect - Callback triggered when student selects this professor.
 * @param {boolean} [props.isSelected=false] - Whether this professor is already selected.
 */
export function ProfessorProfileModal({ 
  professorId, 
  isOpen, 
  onClose, 
  onSelect, 
  isSelected = false 
}) {
  const { professor, isLoading, error } = useProfessorProfile(professorId, isOpen);

  if (!isOpen || !professorId) return null;

  const isFull = professor ? (!professor.isAcceptingProjects || Number(professor.currentProjectCount) >= Number(professor.maxSupervisionCapacity)) : false;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <GraduationCap size={20} className="text-primary" />
            <span>Faculty Advisor Profile</span>
          </div>
          <button 
            onClick={onClose} 
            className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 p-1 transition-colors rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Fetching advisor record & research profile...</p>
            </div>
          ) : error ? (
            <div className="flex gap-2 items-start text-red-700 bg-red-50 border border-red-200 p-4 rounded-lg text-sm font-medium">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error.response?.data?.message || 'Unable to load professor profile details.'}</span>
            </div>
          ) : professor ? (
            <>
              {/* Header Info Block */}
              <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                  {professor.fullName?.charAt(0) || <User size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">
                    {professor.fullName}
                  </h3>
                  
                  {professor.rank && (
                    <span className="inline-block text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md mb-2">
                      {professor.rank}
                    </span>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {professor.department && (
                      <span className="flex items-center gap-1">
                        <Building2 size={13} className="text-slate-400" />
                        {professor.department}
                      </span>
                    )}
                    {professor.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={13} className="text-slate-400" />
                        <a href={`mailto:${professor.email}`} className="hover:underline text-slate-600">
                          {professor.email}
                        </a>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Supervision Capacity Badge */}
              <div className={`p-3.5 rounded-lg border flex items-center justify-between text-xs font-semibold ${
                isFull 
                  ? 'bg-amber-50/80 border-amber-200 text-amber-800' 
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Supervision Capacity</span>
                </div>
                <span>
                  {professor.currentProjectCount ?? 0} / {professor.maxSupervisionCapacity ?? 'N/A'} Active Supervisees
                  {isFull ? ' (At Full Capacity)' : ' (Accepting Students)'}
                </span>
              </div>

              {/* Research Interests / Specialties */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <GraduationCap size={14} className="text-primary" />
                  Research Interests & Expertise
                </div>
                {professor.researchInterests && professor.researchInterests.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {professor.researchInterests.map((topic, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-indigo-50/80 text-indigo-700 border border-indigo-200/60 font-semibold px-2.5 py-1 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No research interests listed.</p>
                )}
              </div>

              {/* About Me / Research Bio */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <BookOpen size={14} className="text-primary" />
                  About & Background
                </div>
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {professor.aboutMe || 'No detailed background provided by this faculty member.'}
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          
          {professor && onSelect && (
            <button
              onClick={() => {
                onSelect(professor);
                onClose();
              }}
              disabled={isFull || isSelected}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600 text-white cursor-default'
                  : isFull
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-primary hover:bg-primary-hover text-white'
              }`}
            >
              {isSelected ? (
                <>
                  <Check size={14} /> Selected Advisor
                </>
              ) : isFull ? (
                'Capacity Reached'
              ) : (
                'Select as Advisor'
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}