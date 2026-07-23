import { useState } from 'react';
import { usePendingApplications } from './usePendingApplications';
import { usePendingTemplates } from './usePendingTemplates';

/**
 * Custom hook encapsulating reviewer dashboard state, tab switching,
 * and top-level metrics fetching for pending provider applications and templates.
 */
export function useReviewerDashboard(initialTab = 'applications') {
  const [activeTab, setActiveTab] = useState(initialTab); // 'applications' | 'templates'

  // Fetch counts for top badge metrics
  const { paginatedResult: appResult } = usePendingApplications(1, 1);
  const { paginatedResult: templateResult } = usePendingTemplates(1, 1);

  const pendingAppsCount = appResult?.totalCount ?? 0;
  const pendingTemplatesCount = templateResult?.totalCount ?? 0;

  const showApplications = () => setActiveTab('applications');
  const showTemplates = () => setActiveTab('templates');

  return {
    activeTab,
    setActiveTab,
    showApplications,
    showTemplates,
    pendingAppsCount,
    pendingTemplatesCount,
  };
}