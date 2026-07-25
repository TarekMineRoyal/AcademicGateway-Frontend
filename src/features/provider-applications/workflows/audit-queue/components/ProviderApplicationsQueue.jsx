import { useReviewProviderApplication } from '../../../shared/hooks/useReviewMutations';
import { useQueueReviewState } from '../../../shared/hooks/useQueueReviewState';
import { ReviewQueueTable, ReviewQueueActionGroup } from '../../../shared/components/ReviewQueueTable';
import { QueuePagination } from '../../../shared/components/QueuePagination';
import { ReviewActionModal } from '../../application-details/components/ReviewActionModal';
import { usePendingApplications } from "@/features/provider-applications/workflows/audit-queue/hooks/usePendingApplications";
import { ApplicationDetailModal } from "@/features/provider-applications/workflows/application-details/components/ApplicationDetailModal";
import { Building2, Mail, Calendar, AlertCircle, Clock } from 'lucide-react';

export function ProviderApplicationsQueue() {
  const {
    pageNumber, setPageNumber, detailModalId, openDetail, closeDetail,
    reviewModalState, openReview, closeReview, handleDetailApprove,
    handleDetailReject, mutationError, submitReview,
  } = useQueueReviewState();

  const { applications, paginatedResult, isLoading, error, refetch } = usePendingApplications(pageNumber, 10);
  const reviewMutation = useReviewProviderApplication();

  const totalPages = paginatedResult?.totalPages || 1;
  const hasPreviousPage = paginatedResult?.hasPreviousPage ?? pageNumber > 1;
  const hasNextPage = paginatedResult?.hasNextPage ?? pageNumber < totalPages;

  const handleReviewSubmit = (formValues) =>
    submitReview(formValues, ({ item, isApproved, rejectionReason }) =>
      reviewMutation.mutateAsync({ applicationId: item.id, isApproved, rejectionReason }), refetch);

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
      <div className="flex justify-between items-center text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
        <span>Showing <strong className="text-slate-800">{applications.length}</strong> of <strong className="text-slate-800">{paginatedResult?.totalCount ?? applications.length}</strong> pending applications</span>
        <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 font-semibold"><Clock size={13} /> Pending Review</span>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 space-y-2">
          <Building2 size={32} className="mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No pending applications</p>
          <p className="text-xs">There are no provider application requests requiring inspection right now.</p>
        </div>
      ) : (
        <ReviewQueueTable
          headers={['Provider / Organization', 'Contact Email', 'Submission Date', { label: 'Actions', align: 'right' }]}
          items={applications}
          renderRow={(app) => {
            const orgName = app.providerName || app.companyName || 'Unspecified Entity';
            const submissionDate = app.submittedAt || app.createdAt;
            return (
              <tr key={app.id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      {orgName.charAt(0) || <Building2 size={16} />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{orgName}</div>
                      {app.websiteUrl && (
                        <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                          {app.websiteUrl.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  {app.contactEmail ? (
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Mail size={13} className="text-slate-400 shrink-0" />
                      <a href={`mailto:${app.contactEmail}`} className="hover:underline text-slate-700">{app.contactEmail}</a>
                    </div>
                  ) : <span className="text-slate-400 italic">N/A</span>}
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  <div className="flex items-center gap-1.5 text-xs"><Calendar size={13} className="text-slate-400" /><span>{submissionDate ? new Date(submissionDate).toLocaleDateString() : 'N/A'}</span></div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <ReviewQueueActionGroup onInspect={() => openDetail(app.id)} onApprove={() => openReview(app, true)} onReject={() => openReview(app, false)} inspectTitle="Inspect full details and documents" approveTitle="Approve Application" rejectTitle="Reject Application" />
                </td>
              </tr>
            );
          }}
        />
      )}

      <QueuePagination pageNumber={pageNumber} totalPages={totalPages} hasPreviousPage={hasPreviousPage} hasNextPage={hasNextPage} onPageChange={setPageNumber} />
      <ApplicationDetailModal applicationId={detailModalId} isOpen={!!detailModalId} onClose={closeDetail} onApprove={handleDetailApprove} onReject={handleDetailReject} />
      <ReviewActionModal isOpen={reviewModalState.isOpen} onClose={() => closeReview(reviewMutation.isPending)} onSubmit={handleReviewSubmit} isApproved={reviewModalState.isApproved} targetTitle={reviewModalState.item?.providerName || reviewModalState.item?.companyName} isSubmitting={reviewMutation.isPending} error={mutationError} />
    </div>
  );
}