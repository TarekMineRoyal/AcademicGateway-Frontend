import { Building2, GraduationCap } from 'lucide-react';
import { ProjectTemplateStatus } from '../../../shared/constants/enums';

const getStatusBadgeConfig = (statusToken) => {
  switch (statusToken) {
    case ProjectTemplateStatus.DRAFT: 
      return { text: 'Draft', classes: 'bg-slate-100 text-slate-700 border-slate-700/20' };
    case ProjectTemplateStatus.PENDING_REVIEW: 
      return { text: 'Pending Review', classes: 'bg-amber-100 text-amber-700 border-amber-700/20' };
    case ProjectTemplateStatus.CHANGES_REQUESED: 
      return { text: 'Changes Requested', classes: 'bg-red-50 text-red-600 border-red-600/20' };
    case ProjectTemplateStatus.PENDING_PROVIDER_ACCEPTANCE: 
      return { text: 'Pending Acceptance', classes: 'bg-sky-100 text-sky-700 border-sky-700/20' };
    case ProjectTemplateStatus.APPROVED: 
      return { text: 'Publicly Approved', classes: 'bg-green-50 text-green-700 border-green-700/20' };
    case ProjectTemplateStatus.REJECTED: 
      return { text: 'Rejected', classes: 'bg-red-50 text-red-700 border-red-700/20' };
    case ProjectTemplateStatus.ARCHIVED: 
      return { text: 'Archived', classes: 'bg-slate-50 text-slate-400 border-slate-400/20' };
    default: 
      return { text: 'Unknown Identity', classes: 'bg-slate-100 text-slate-700 border-slate-700/20' };
  }
};

function TemplateHeader({
  title,
  description,
  statusToken,
  providerCompanyName = 'Enterprise Sponsor Partner',
  totalEstimatedScope = 0,
  totalCheckpoints = 0,
  majorName = null,
  specialtyName = null
}) {
  const statusBadge = getStatusBadgeConfig(statusToken);

  return (
    <div>
      <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
            <Building2 size={14} />
            <span className="text-slate-900 font-bold hover:text-primary hover:underline cursor-pointer transition-colors">
              {providerCompanyName}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2">{title}</h1>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusBadge.classes}`}>
          Status: {statusBadge.text}
        </span>
      </div>

      <div className="flex items-center gap-6 bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-sm font-semibold text-slate-700 mb-6">
        <div>Total Estimated Scope: <span className="text-slate-900 font-extrabold">{totalEstimatedScope} hrs</span></div>
        <div className="w-px h-4 bg-slate-300/60" />
        <div>Total Checkpoints: <span className="text-slate-900 font-extrabold">{totalCheckpoints}</span></div>
      </div>

      <p className="text-slate-600 text-[0.95rem] leading-relaxed whitespace-pre-line mb-6">
        {description}
      </p>

      {/* Academic Alignment Details Section */}
      <div className="border-t border-slate-200/60 w-full pt-6 mb-6">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
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
    </div>
  );
}

export default TemplateHeader;