import React, { useState } from 'react';
import { usePendingApplications } from '../hooks/usePendingApplications';
import { usePendingTemplates } from '../hooks/usePendingTemplates';
import { ProviderApplicationsQueue } from './ProviderApplicationsQueue';
import { ProjectTemplatesQueue } from './ProjectTemplatesQueue';
import { 
  ShieldCheck, 
  Building2, 
  Layers, 
  FileCheck2 
} from 'lucide-react';

export default function ReviewerDashboard() {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'templates'

  // Lightweight fetches to keep top badge metrics dynamically synchronized
  const { paginatedResult: appResult } = usePendingApplications(1, 1);
  const { paginatedResult: templateResult } = usePendingTemplates(1, 1);

  const pendingAppsCount = appResult?.totalCount ?? 0;
  const pendingTemplatesCount = templateResult?.totalCount ?? 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight">
              Reviewer Vetting Dashboard
            </h1>
          </div>
          <p className="text-slate-600 text-sm md:text-base ml-11">
            Inspect, evaluate, and issue formal decisions on pending provider registration applications and project template blueprints.
          </p>
        </div>
      </div>

      {/* Overview Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => setActiveTab('applications')}
          className={`p-5 rounded-card border transition-all duration-200 cursor-pointer flex items-center justify-between ${
            activeTab === 'applications'
              ? 'bg-white border-primary shadow-md ring-2 ring-primary/10'
              : 'bg-white/80 border-slate-200/60 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queue 1</p>
              <h3 className="text-base font-bold text-slate-800">Provider Applications</h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-brand-dark">{pendingAppsCount}</span>
            <span className="block text-[11px] text-slate-400 font-medium">Awaiting Review</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('templates')}
          className={`p-5 rounded-card border transition-all duration-200 cursor-pointer flex items-center justify-between ${
            activeTab === 'templates'
              ? 'bg-white border-primary shadow-md ring-2 ring-primary/10'
              : 'bg-white/80 border-slate-200/60 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queue 2</p>
              <h3 className="text-base font-bold text-slate-800">Project Templates</h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-brand-dark">{pendingTemplatesCount}</span>
            <span className="block text-[11px] text-slate-400 font-medium">Awaiting Review</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation Controls */}
      <div className="border-b border-slate-200 flex gap-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Building2 size={16} />
          <span>Provider Applications</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'applications'
              ? 'bg-primary/10 text-primary'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {pendingAppsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'templates'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <FileCheck2 size={16} />
          <span>Pending Project Templates</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'templates'
              ? 'bg-primary/10 text-primary'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {pendingTemplatesCount}
          </span>
        </button>
      </div>

      {/* Active Queue Table Container */}
      <div className="bg-white rounded-card border border-slate-200/60 shadow-sm p-6">
        {activeTab === 'applications' ? (
          <ProviderApplicationsQueue />
        ) : (
          <ProjectTemplatesQueue />
        )}
      </div>

    </div>
  );
}

export { ReviewerDashboard };