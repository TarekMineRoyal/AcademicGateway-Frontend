import { Sparkles } from 'lucide-react';

/**
 * Renders required skills and capabilities for a project template blueprint.
 */
export function TemplateSkillsList({ skills, template }) {
  const requiredSkills = skills ?? template?.requiredSkills ?? template?.skills ?? [];

  if (!requiredSkills || requiredSkills.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        <Sparkles size={14} className="text-primary" />
        Required Skills & Capabilities
      </div>
      <div className="flex flex-wrap gap-1.5">
        {requiredSkills.map((sk, idx) => (
          <span
            key={sk.id || idx}
            className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md border border-slate-200"
          >
            {typeof sk === 'object' ? sk.name : sk}
          </span>
        ))}
      </div>
    </div>
  );
}