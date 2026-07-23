import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { ProfessorProfileModal } from '../../../professor';
import InitiationModeSelector from './InitiationModeSelector';
import SupervisedInitiationView from './SupervisedInitiationView';

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
  handleFinalizePipelineInstantiation,
}) {
  if (!isModalOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Modal Header */}
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

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto">
            {modalError && (
              <div className="flex gap-2 items-start text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-sm font-medium mb-4">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                <span>{modalError}</span>
              </div>
            )}

            {initiationMode === null && (
              <InitiationModeSelector onSelectMode={(mode) => setInitiationMode(mode)} />
            )}

            {initiationMode === 'supervised' && (
              <SupervisedInitiationView
                templateId={templateId}
                isStudent={isStudent}
                primaryDiscipline={primaryDiscipline}
                directoryResults={directoryResults}
                directoryPagination={directoryPagination}
                isSearching={isSearching}
                professorSearchQuery={professorSearchQuery}
                setProfessorSearchQuery={setProfessorSearchQuery}
                setSearchPage={setSearchPage}
                selectedProfessor={selectedProfessor}
                setSelectedProfessor={setSelectedProfessor}
                setViewingProfessorId={setViewingProfessorId}
                setInitiationMode={setInitiationMode}
              />
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

          {/* Modal Footer */}
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