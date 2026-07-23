import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContextCore';
import { initializeProjectInstance } from '../../project-instances';

export function useProjectInitiation(templateId) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Workflow Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initiationMode, setInitiationMode] = useState(null); 
  const [professorSearchQuery, setProfessorSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [viewingProfessorId, setViewingProfessorId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Manage UI-only search debounce
  useEffect(() => {
    if (initiationMode !== 'supervised') return;

    const handler = setTimeout(() => {
      setDebouncedSearch(professorSearchQuery);
      setSearchPage(1); // Reset to first page whenever query string changes
    }, 300); // 300ms debounce buffer

    return () => clearTimeout(handler);
  }, [professorSearchQuery, initiationMode]);

  const handleOpenInitiationModal = () => {
    setIsModalOpen(true);
    setInitiationMode(null);
    setProfessorSearchQuery('');
    setDebouncedSearch('');
    setSearchPage(1);
    setSelectedProfessor(null);
    setViewingProfessorId(null);
    setModalError('');
  };

  const handleCloseInitiationModal = () => {
    if (submitLoading) return;
    setIsModalOpen(false);
  };

  const handleFinalizePipelineInstantiation = async () => {
    if (initiationMode === 'supervised' && !selectedProfessor) {
      setModalError('Please explicitly select a target supervisor to deploy the request.');
      return;
    }

    try {
      setSubmitLoading(true);
      setModalError('');
      
      await initializeProjectInstance(
        templateId, 
        initiationMode === 'supervised' ? selectedProfessor.id : null
      );

      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['studentDashboard', user.id] });
      }

      setIsModalOpen(false);
      navigate('/dashboard');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to dispatch allocation request commands to server.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return {
    isModalOpen,
    initiationMode,
    setInitiationMode,
    professorSearchQuery,
    setProfessorSearchQuery,
    debouncedSearch,
    searchPage,
    setSearchPage,
    selectedProfessor,
    setSelectedProfessor,
    viewingProfessorId,
    setViewingProfessorId,
    submitLoading,
    modalError,
    handleOpenInitiationModal,
    handleCloseInitiationModal,
    handleFinalizePipelineInstantiation
  };
}