import { GraduationCap } from 'lucide-react';

/**
 * Renders the academic alignment (major, specialty) for a project template blueprint.
 */
export function TemplateAcademicAlignment({ template }) {
  if (!template) return null;

  const { majorName, specialtyName } = template;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        <GraduationCap size={14} className="text-primary" />
        Academic Alignment
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {majorName || specialtyName ? (
          <>
            {majorName && (
              <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200/70 font-bold px-3 py-1 rounded-md">
                Major: {majorName}
              </span>
            )}
            {specialtyName && (
              <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200/70 font-bold px-3 py-1 rounded-md">
                Specialty: {specialtyName}
              </span>
            )}
          </>
        ) : (
          <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 font-semibold px-3 py-1 rounded-md italic">
            All Majors / General Alignment
          </span>
        )}
      </div>
    </div>
  );
}