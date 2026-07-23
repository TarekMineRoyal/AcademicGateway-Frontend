import { useState } from 'react';
import { usePendingApplications } from '../hooks/usePendingApplications';
import { useReviewProviderApplication } from '../hooks/useReviewMutations';
import { ReviewActionModal } from './ReviewActionModal';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { 
  Building2, 
  Mail, 
  Calendar, 
  Eye, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Clock
} from 'lucide-react';

export function ProviderApplicationsQueue() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Data Query
  const { applications, paginatedResult, isLoading, error, refetch } = usePendingApplications(pageNumber, pageSize);

  // Review Mutation
  const reviewMutation = useReviewProviderApplication();

  // Modal States
  const [detailModalAppId, setDetailModalAppId] = useState(null);
  const [reviewModalState, setReviewModalState] = useState({
    isOpen: false,
    app: null,
    isApproved: true,
  });
  const [mutationError, setMutationError] = useState(null);

  // Pagination bounds safety
  const totalPages = paginatedResult?.totalPages || 1;
  const hasPreviousPage = paginatedResult?.hasPreviousPage ?? pageNumber > 1;
  const hasNextPage = paginatedResult?.hasNextPage ?? pageNumber < totalPages;

  // Trigger Review Modal
  const handleOpenReview = (app, isApproved) => {
    setMutationError(null);
    setReviewModalState({
      isOpen: true,
      app,
      isApproved,
    });
  };

  const handleCloseReview = () => {
    if (reviewMutation.isPending) return;
    setReviewModalState({ isOpen: false, app: null, isApproved: true });
    setMutationError(null);
  };

  // Submit Decision
  const handleReviewSubmit = async ({ isApproved, rejectionReason }) => {
    if (!reviewModalState.app) return;
    setMutationError(null);

    try {
      await reviewMutation.mutateAsync({
        applicationId: reviewModalState.app.id,
        isApproved,
        rejectionReason,
      });
      handleCloseReview();
      refetch();
    } catch (err) {
      setMutationError(
        err.response?.data?.message || err.message || 'Failed to submit review decision. Please try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Fetching pending provider applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-2 items-start text-red-700 bg-red-50 border border-red-200 p-4 rounded-lg text-xs font-medium">
        <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
        <span>{error.response?.data?.message || 'Failed to load pending provider applications.'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Subheader / Record Counter */}
      <div className="flex justify-between items-center text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
        <span>
          Showing <strong className="text-slate-800">{applications.length}</strong> of{' '}
          <strong className="text-slate-800">{paginatedResult?.totalCount ?? applications.length}</strong> pending applications
        </span>
        <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 font-semibold">
          <Clock size={13} /> Pending Review
        </span>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 space-y-2">
          <Building2 size={32} className="mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No pending applications</p>
          <p className="text-xs">There are no provider application requests requiring inspection right now.</p>
        </div>
      ) : (
        /* Applications Table */
        <div className="overflow-x-auto rounded-lg border border-slate-200/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Provider / Organization</th>
                <th className="py-3 px-4">Contact Email</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {applications.map((app) => {
                // Exact key mappings provided by backend team
                const orgName = app.providerName || app.companyName || 'Unspecified Entity';
                const submissionDate = app.submittedAt || app.createdAt;

                return (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors group">
                    
                    {/* Provider / Organization Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          {orgName.charAt(0) || <Building2 size={16} />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{orgName}</div>
                          {app.websiteUrl && (
                            <a
                              href={app.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {app.websiteUrl.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Email Column */}
                    <td className="py-3.5 px-4">
                      {app.contactEmail ? (
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Mail size={13} className="text-slate-400 shrink-0" />
                          <a href={`mailto:${app.contactEmail}`} className="hover:underline text-slate-700">
                            {app.contactEmail}
                          </a>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">N/A</span>
                      )}
                    </td>

                    {/* Submission Date Column */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{submissionDate ? new Date(submissionDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>

                    {/* Action Buttons Column */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailModalAppId(app.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Inspect full details and documents"
                        >
                          <Eye size={14} className="text-slate-500" />
                          <span>Inspect</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenReview(app, true)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Approve Application"
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenReview(app, false)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Reject Application"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-500">
            Page <strong className="text-slate-800">{pageNumber}</strong> of <strong className="text-slate-800">{totalPages}</strong>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!hasPreviousPage}
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              type="button"
              disabled={!hasNextPage}
              onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Detail Inspector Modal */}
      <ApplicationDetailModal
        applicationId={detailModalAppId}
        isOpen={!!detailModalAppId}
        onClose={() => setDetailModalAppId(null)}
        onApprove={(app) => {
          setDetailModalAppId(null);
          handleOpenReview(app, true);
        }}
        onReject={(app) => {
          setDetailModalAppId(null);
          handleOpenReview(app, false);
        }}
      />

      {/* Decision Review Action Modal */}
      <ReviewActionModal
        isOpen={reviewModalState.isOpen}
        onClose={handleCloseReview}
        onSubmit={handleReviewSubmit}
        isApproved={reviewModalState.isApproved}
        targetTitle={reviewModalState.app?.providerName || reviewModalState.app?.companyName}
        isSubmitting={reviewMutation.isPending}
        error={mutationError}
      />
    </div>
  );
}