import React from 'react';
import { 
  Sparkles, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Activity 
} from 'lucide-react';
import { AdvisorCard, useRecommendedProfessors } from '../../../recommendations';
import DirectoryProfessorCard from './DirectoryProfessorCard';

export function SupervisedInitiationView({
  templateId,
  isStudent = false,
  primaryDiscipline,
  directoryResults = [],
  directoryPagination = null,
  isSearching = false,
  professorSearchQuery,
  setProfessorSearchQuery,
  setSearchPage,
  selectedProfessor,
  setSelectedProfessor,
  setViewingProfessorId,
  setInitiationMode,
}) {
  // AI Vector Recommendation Engine Integration for Faculty Advisors
  const { 
    recommendedProfessors = [], 
    isLoading: isRecsLoading 
  } = useRecommendedProfessors(
    templateId, 
    5, 
    isStudent
  );

  return (
    <div>
      <button 
        onClick={() => { setInitiationMode(null); setSelectedProfessor(null); }} 
        className="bg-transparent border-none text-primary hover:text-primary-hover text-xs font-bold cursor-pointer flex items-center gap-1 mb-4 p-0 transition-colors"
      >
        ← Back to selection options
      </button>

      {/* AI Recommended Advisors Section */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 uppercase tracking-wider mb-3">
          <Sparkles size={14} className="text-indigo-600" />
          AI Recommended Advisors
        </div>
        
        {isRecsLoading ? (
          <div className="p-4 text-xs text-slate-400 text-center bg-slate-50 rounded-xl animate-pulse font-medium border border-slate-100">
            Calculating vector-similarity faculty matches...
          </div>
        ) : recommendedProfessors.length > 0 ? (
          <div className="space-y-3">
            {recommendedProfessors.map((prof, idx) => (
              <AdvisorCard
                key={prof.id}
                professor={prof}
                rankIndex={idx}
                isSelected={selectedProfessor?.id === prof.id}
                onSelect={(selected) => setSelectedProfessor(selected)}
                onViewProfile={(targetProf) => setViewingProfessorId(targetProf.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 text-xs text-slate-400 text-center bg-slate-50 rounded-xl font-medium border border-slate-100">
            No AI advisor recommendations found for this template.
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-center my-5">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
          Or Search Full Directory
        </span>
      </div>
      
      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
        Search Advisor Directory
      </label>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Type name, campus handle, or academic email..."
          value={professorSearchQuery}
          onChange={(e) => setProfessorSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>

      <div className="border border-slate-200 rounded-lg max-h-[220px] overflow-y-auto bg-slate-50/50">
        {isSearching ? (
          <div className="p-4 text-xs text-slate-500 text-center">Querying corporate faculty clusters...</div>
        ) : directoryResults.length === 0 ? (
          <div className="p-4 text-xs text-slate-400 text-center">
            {professorSearchQuery ? 'No matching faculty identities found.' : 'Type to query directory grid...'}
          </div>
        ) : (
          directoryResults.map((prof) => (
            <DirectoryProfessorCard
              key={prof.id}
              professor={prof}
              primaryDiscipline={primaryDiscipline}
              isSelected={selectedProfessor?.id === prof.id}
              onSelect={(selected) => setSelectedProfessor(selected)}
              onViewProfile={(profId) => setViewingProfessorId(profId)}
            />
          ))
        )}
      </div>

      {/* UI Controls for Directory Pagination */}
      {directoryPagination && directoryPagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 px-1 text-xs text-slate-500">
          <span>
            Page <strong>{directoryPagination.pageNumber}</strong> of <strong>{directoryPagination.totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!directoryPagination.hasPreviousPage || isSearching}
              onClick={() => setSearchPage((prev) => Math.max(prev - 1, 1))}
              className="p-1 border rounded bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              disabled={!directoryPagination.hasNextPage || isSearching}
              onClick={() => setSearchPage((prev) => prev + 1)}
              className="p-1 border rounded bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {selectedProfessor && (
        <div className="mt-5 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <Activity size={14} className="text-green-600" />
          <span className="text-xs text-green-800">
            Selected: <strong>{selectedProfessor.fullName}</strong> will receive the request.
          </span>
        </div>
      )}
    </div>
  );
}

export default SupervisedInitiationView;