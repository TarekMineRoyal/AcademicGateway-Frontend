import { useProviderDashboard } from '../hooks/useProviderDashboard';
import { Building2, FolderPlus, FileText, CheckCircle2 } from 'lucide-react';

export default function ProviderDashboard() {
  const { isLoading, error } = useProviderDashboard();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Building2 size={22} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight">
              Provider Dashboard
            </h1>
          </div>
          <p className="text-slate-600 text-sm md:text-base ml-11">
            Manage your organization details, submit project templates, and monitor active project proposals.
          </p>
        </div>
      </div>

      {/* Overview Metric Placeholder Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-card bg-white border border-slate-200/60 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
            <FolderPlus size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Templates</p>
            <h3 className="text-base font-bold text-slate-800">Submitted Blueprints</h3>
          </div>
        </div>

        <div className="p-5 rounded-card bg-white border border-slate-200/60 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
            <h3 className="text-base font-bold text-slate-800">Application Review</h3>
          </div>
        </div>

        <div className="p-5 rounded-card bg-white border border-slate-200/60 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projects</p>
            <h3 className="text-base font-bold text-slate-800">Active Instances</h3>
          </div>
        </div>
      </div>

      {/* Workspace Container Placeholder */}
      <div className="bg-white rounded-card border border-slate-200/60 shadow-sm p-8 text-center text-slate-500">
        <p className="font-medium">
          {isLoading ? 'Loading workspace...' : error ? 'Error loading workspace.' : 'Provider workspace scaffold ready for feature development.'}
        </p>
      </div>
    </div>
  );
}

export { ProviderDashboard };