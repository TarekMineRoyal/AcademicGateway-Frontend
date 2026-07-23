import { 
  X, 
  AlertCircle, 
  Zap, 
  UserCheck, 
  Sparkles, 
  Search, 
  User, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Eye 
} from 'lucide-react';
import { AdvisorCard, useRecommendedProfessors } from '../../../recommendations';
import { ProfessorProfileModal } from '../../../professor';

function ProjectInitiationModal({
  templateId,
  title,
  primaryDiscipline,
  isStudent = false,
  directoryResults = [],
  directoryPagination = null,
  isSearching = false,
  // Hook state & handlers from useProjectInitiation
  isModalOpen,
  initiationMode,
  setInitiationMode,
  professorSearchQuery,
  setProfessorSearchQuery,
  setSearchPage,
  selectedProfessor,
  setSelectedProfessor,
  viewingProfessorId,
  setViewingProfessorId,
  submitLoading,
  modalError,
  handleCloseInitiationModal,
  handleFinalizePipelineInstantiation
}) {
  // AI Vector Recommendation Engine Integration for Faculty Advisors
  const { 
    recommendedProfessors = [], 
    isLoading: isRecsLoading 
  } = useRecommendedProfessors(
    templateId, 
    5, 
    isStudent && initiationMode === 'supervised'
  );

  if (!isModalOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-base font-bold text-slate-900">Project Initialization Matrix</h3>
            <button 
              onClick={handleCloseInitiationModal} 
              disabled={submitLoading} 
              className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 p-1 transition-colors disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {modalError && (
              <div className="flex gap-2 items-start text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-sm font-medium mb-4">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                <span>{modalError}</span>
              </div>
            )}

            {initiationMode === null && (
              <div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Select how you want to deploy this capstone aggregate model workspace track. You can modify mentorship settings post-launch.
                </p>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setInitiationMode('solo')}
                    className="w-full p-5 border-2 border-slate-200 hover:border-primary rounded-xl bg-white text-left cursor-pointer flex gap-4 items-center hover:bg-slate-50/60 transition-all duration-150 shadow-xs"
                  >
                    <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
                      <Zap size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 mb-0.5">Deploy in Solo Execution Mode</h4>
                      <p className="text-slate-500 text-xs leading-normal">Instantiates the runtime workspace track immediately. You hold the ability to invite a faculty advisor later.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setInitiationMode('supervised')}
                    className="w-full p-5 border-2 border-slate-200 hover:border-primary rounded-xl bg-white text-left cursor-pointer flex gap-4 items-center hover:bg-slate-50/60 transition-all duration-150 shadow-xs"
                  >
                    <div className="p-2 bg-green-50 text-green-700 rounded-lg">
                      <UserCheck size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 mb-0.5">Request Faculty Academic Supervision</h4>
                      <p className="text-slate-500 text-xs leading-normal">Search our verified faculty registry to route an invitation. Track status will remain pending until approved.</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {initiationMode === 'supervised' && (
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
                    directoryResults.map(prof => {
                      const isChosen = selectedProfessor?.id === prof.id;
                      
                      const {
                        fullName,
                        email,
                        currentProjectCount = 0,
                        maxSupervisionCapacity,
                        isAcceptingProjects = true,
                        researchInterests = [],
                        specialties = []
                      } = prof;

                      const hasLimit = maxSupervisionCapacity !== undefined && maxSupervisionCapacity !== null && Number(maxSupervisionCapacity) > 0;
                      const isFull = !isAcceptingProjects || (hasLimit && Number(currentProjectCount) >= Number(maxSupervisionCapacity));

                      const profInterests = researchInterests.length > 0 ? researchInterests : specialties;
                      const isDomainExpert = primaryDiscipline && profInterests.some(spec => {
                        const specStr = typeof spec === 'object' ? (spec.name || '') : String(spec);
                        return specStr.toLowerCase().includes(primaryDiscipline.toLowerCase()) || primaryDiscipline.toLowerCase().includes(specStr.toLowerCase());
                      });

                      return (
                        <div 
                          key={prof.id}
                          className={`p-3 border-b border-slate-100 transition-colors flex items-center justify-between ${
                            isChosen ? 'bg-sky-50/70' : 'bg-transparent hover:bg-slate-50'
                          } ${isFull ? 'opacity-50' : ''}`}
                        >
                          <div 
                            onClick={() => !isFull && setSelectedProfessor(prof)}
                            className="flex items-start gap-2.5 flex-1 cursor-pointer min-w-0"
                          >
                            <User size={15} className={`mt-0.5 shrink-0 ${isChosen ? 'text-primary' : 'text-slate-500'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                                <span>{fullName}</span>
                                {isDomainExpert && (
                                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0">
                                    ✨ Domain Expert
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">{email}</div>
                              
                              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                                <span>Available Slots: {currentProjectCount} / {maxSupervisionCapacity ?? 'N/A'}</span>
                              </div>

                              {profInterests.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {profInterests.map((spec, sIdx) => (
                                    <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
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
                              onClick={() => setViewingProfessorId(prof.id)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                              title="View Profile"
                            >
                              <Eye size={15} />
                            </button>
                            {isChosen && <Check size={16} className="text-primary shrink-0" />}
                          </div>
                        </div>
                      );
                    })
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
                        onClick={() => setSearchPage(prev => Math.max(prev - 1, 1))}
                        className="p-1 border rounded bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={!directoryPagination.hasNextPage || isSearching}
                        onClick={() => setSearchPage(prev => prev + 1)}
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
            )}

            {initiationMode === 'solo' && (
              <div className="text-center py-2">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  You are initializing <strong>{title}</strong> in standalone mode. 
                </p>
                <p className="text-slate-500 text-xs">
                  Your pipeline record tracks as an active instance immediately upon checkout.
                </p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button 
              onClick={handleCloseInitiationModal} 
              disabled={submitLoading}
              className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            {initiationMode !== null && (
              <button 
                onClick={handleFinalizePipelineInstantiation}
                disabled={submitLoading || (initiationMode === 'supervised' && !selectedProfessor)}
                className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Deploying Track...' : 'Confirm and Initialize'}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Faculty Advisor Public Profile Modal */}
      <ProfessorProfileModal
        professorId={viewingProfessorId}
        isOpen={Boolean(viewingProfessorId)}
        onClose={() => setViewingProfessorId(null)}
        onSelect={(prof) => setSelectedProfessor(prof)}
        isSelected={selectedProfessor?.id === viewingProfessorId}
      />
    </>
  );
}

export default ProjectInitiationModal;