import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContextCore';
import { initializeProjectInstance } from '../../project-instances';
import { useDebounce } from '../../../shared/hooks/useDebounce';

const INITIAL_MODAL_STATE = {
  isOpen: false,
  mode: null,
  searchQuery: '',
  searchPage: 1,
  selectedProfessor: null,
  viewingProfessorId: null,
  submitLoading: false,
  error: '',
};

export function useProjectInitiation(templateId) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [modalState, setModalState] = useState(INITIAL_MODAL_STATE);

  // Extract debounced search query using the shared useDebounce hook
  const debouncedSearch = useDebounce(
    modalState.mode === 'supervised' ? modalState.searchQuery : '',
    300
  );

  // Reset search page index when the debounced search term changes
  useEffect(() => {
    setModalState((prev) => ({ ...prev, searchPage: 1 }));
  }, [debouncedSearch]);

  const handleOpenInitiationModal = () => {
    setModalState({
      ...INITIAL_MODAL_STATE,
      isOpen: true,
    });
  };

  const handleCloseInitiationModal = () => {
    if (modalState.submitLoading) return;
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const setInitiationMode = (mode) => {
    setModalState((prev) => ({ ...prev, mode }));
  };

  const setProfessorSearchQuery = (searchQuery) => {
    setModalState((prev) => ({ ...prev, searchQuery }));
  };

  const setSearchPage = (searchPage) => {
    setModalState((prev) => ({
      ...prev,
      searchPage: typeof searchPage === 'function' ? searchPage(prev.searchPage) : searchPage,
    }));
  };

  const setSelectedProfessor = (selectedProfessor) => {
    setModalState((prev) => ({ ...prev, selectedProfessor }));
  };

  const setViewingProfessorId = (viewingProfessorId) => {
    setModalState((prev) => ({ ...prev, viewingProfessorId }));
  };

  const handleFinalizePipelineInstantiation = async () => {
    if (modalState.mode === 'supervised' && !modalState.selectedProfessor) {
      setModalState((prev) => ({
        ...prev,
        error: 'Please explicitly select a target supervisor to deploy the request.',
      }));
      return;
    }

    try {
      setModalState((prev) => ({ ...prev, submitLoading: true, error: '' }));

      await initializeProjectInstance(
        templateId,
        modalState.mode === 'supervised' ? modalState.selectedProfessor.id : null
      );

      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['studentDashboard', user.id] });
      }

      setModalState((prev) => ({ ...prev, isOpen: false, submitLoading: false }));
      navigate('/dashboard');
    } catch (err) {
      setModalState((prev) => ({
        ...prev,
        submitLoading: false,
        error: err.response?.data?.message || 'Failed to dispatch allocation request commands to server.',
      }));
    }
  };

  return {
    isModalOpen: modalState.isOpen,
    initiationMode: modalState.mode,
    setInitiationMode,
    professorSearchQuery: modalState.searchQuery,
    setProfessorSearchQuery,
    debouncedSearch,
    searchPage: modalState.searchPage,
    setSearchPage,
    selectedProfessor: modalState.selectedProfessor,
    setSelectedProfessor,
    viewingProfessorId: modalState.viewingProfessorId,
    setViewingProfessorId,
    submitLoading: modalState.submitLoading,
    modalError: modalState.error,
    handleOpenInitiationModal,
    handleCloseInitiationModal,
    handleFinalizePipelineInstantiation,
  };
}