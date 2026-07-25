import { User, Eye, Check } from 'lucide-react';
import { isProfessorFull, isDomainExpert, getProfessorInterests } from "@/features/project-templates/workflows/initiation/utils/professorMatching";

export function DirectoryProfessorCard({
  professor,
  primaryDiscipline,
  isSelected,
  onSelect,
  onViewProfile,
}) {
  const {
    id,
    fullName,
    email,
    currentProjectCount = 0,
    maxSupervisionCapacity,
  } = professor;

  const isFull = isProfessorFull(professor);
  const isExpert = isDomainExpert(professor, primaryDiscipline);
  const profInterests = getProfessorInterests(professor);

  return (
    <div
      className={`p-3 border-b border-slate-100 transition-colors flex items-center justify-between ${
        isSelected ? 'bg-sky-50/70' : 'bg-transparent hover:bg-slate-50'
      } ${isFull ? 'opacity-50' : ''}`}
    >
      <div
        onClick={() => !isFull && onSelect(professor)}
        className="flex items-start gap-2.5 flex-1 cursor-pointer min-w-0"
      >
        <User
          size={15}
          className={`mt-0.5 shrink-0 ${isSelected ? 'text-primary' : 'text-slate-500'}`}
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
            <span>{fullName}</span>
            {isExpert && (
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0">
                ✨ Domain Expert
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 truncate">{email}</div>

          <div className="text-[11px] font-medium text-slate-500 mt-0.5">
            <span>
              Available Slots: {currentProjectCount} / {maxSupervisionCapacity ?? 'N/A'}
            </span>
          </div>

          {profInterests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {profInterests.map((spec, sIdx) => (
                <span
                  key={sIdx}
                  className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                >
                  {typeof spec === 'object' ? spec.name : spec}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        <button
          type="button"
          onClick={() => onViewProfile(id)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
          title="View Profile"
        >
          <Eye size={15} />
        </button>
        {isSelected && <Check size={16} className="text-primary shrink-0" />}
      </div>
    </div>
  );
}

export default DirectoryProfessorCard;