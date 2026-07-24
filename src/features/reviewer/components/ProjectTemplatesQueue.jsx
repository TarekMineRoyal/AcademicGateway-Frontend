import { usePendingTemplates } from '../hooks/usePendingTemplates';
import { useReviewProjectTemplate } from '../hooks/useReviewMutations';
import { useQueueReviewState } from '../hooks/useQueueReviewState';
import { ReviewQueueTable, ReviewQueueActionGroup } from './ReviewQueueTable';
import { QueuePagination } from './QueuePagination';
import { ReviewActionModal } from './ReviewActionModal';
import { TemplateDetailModal } from './TemplateDetailModal';
import { Layers, Calendar, AlertCircle, Clock, GraduationCap } from 'lucide-react';

export function ProjectTemplatesQueue() {
  const {
    pageNumber, setPageNumber, detailModalId, openDetail, closeDetail,
    reviewModalState, openReview, closeReview, handleDetailApprove,
    handleDetailReject, mutationError, submitReview,
  } = useQueueReviewState();

  const { templates, paginatedResult, isLoading, error, refetch } = usePendingTemplates(pageNumber, 10);
  const reviewMutation = useReviewProjectTemplate();

  const totalPages = paginatedResult?.totalPages || 1;
  const hasPreviousPage = paginatedResult?.hasPreviousPage ?? pageNumber > 1;
  const hasNextPage = paginatedResult?.hasNextPage ?? pageNumber < totalPages;

  const handleReviewSubmit = (formValues) =>
    submitReview(formValues, ({ item, isApproved, rejectionReason }) =>
      reviewMutation.mutateAsync({ templateId: item.id, isApproved, rejectionReason }), refetch);

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Fetching pending project templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-2 items-start text-red-700 bg-red-50 border border-red-200 p-4 rounded-lg text-xs font-medium">
        <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
        <span>{error.response?.data?.message || 'Failed to load pending project templates.'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
        <span>Showing <strong className="text-slate-800">{templates.length}</strong> of <strong className="text-slate-800">{paginatedResult?.totalCount ?? templates.length}</strong> pending templates</span>
        <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 font-semibold"><Clock size={13} /> Pending Review</span>
      </div>

      {templates.length === 0 ? (
        <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 space-y-2">
          <Layers size={32} className="mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No pending project templates</p>
          <p className="text-xs">There are no project template blueprints awaiting evaluation at this time.</p>
        </div>
      ) : (
        <ReviewQueueTable
          headers={['Template Title & Overview', 'Academic Alignment', 'Submission Date', { label: 'Actions', align: 'right' }]}
          items={templates}
          renderRow={(template) => (
            <tr key={template.id} className="hover:bg-slate-50/70 transition-colors group">
              <td className="py-3.5 px-4 max-w-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold shrink-0 mt-0.5"><Layers size={18} /></div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-sm line-clamp-1">{template.title}</div>
                    <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5 leading-relaxed">{template.description || 'No detailed summary provided.'}</p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="space-y-1">
                  {template.majorName ? (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md"><GraduationCap size={12} /><span>{template.majorName}</span></div>
                  ) : <span className="text-slate-400 text-[11px] italic">General Academic Track</span>}
                  {template.specialtyName && <div className="text-[11px] text-slate-500 font-medium">Specialty: <span className="text-slate-700 font-semibold">{template.specialtyName}</span></div>}
                </div>
              </td>
              <td className="py-3.5 px-4 text-slate-600">
                <div className="flex items-center gap-1.5 text-xs"><Calendar size={13} className="text-slate-400" /><span>{(template.submittedAt || template.createdAt) ? new Date(template.submittedAt || template.createdAt).toLocaleDateString() : 'N/A'}</span></div>
              </td>
              <td className="py-3.5 px-4 text-right">
                <ReviewQueueActionGroup onInspect={() => openDetail(template.id)} onApprove={() => openReview(template, true)} onReject={() => openReview(template, false)} inspectTitle="Inspect structure, milestones, tasks, and skills" approveTitle="Approve Project Template" rejectTitle="Reject Project Template" />
              </td>
            </tr>
          )}
        />
      )}

      <QueuePagination pageNumber={pageNumber} totalPages={totalPages} hasPreviousPage={hasPreviousPage} hasNextPage={hasNextPage} onPageChange={setPageNumber} />
      <TemplateDetailModal templateId={detailModalId} isOpen={!!detailModalId} onClose={closeDetail} onApprove={handleDetailApprove} onReject={handleDetailReject} />
      <ReviewActionModal isOpen={reviewModalState.isOpen} onClose={() => closeReview(reviewMutation.isPending)} onSubmit={handleReviewSubmit} isApproved={reviewModalState.isApproved} targetTitle={reviewModalState.item?.title} isSubmitting={reviewMutation.isPending} error={mutationError} />
    </div>
  );
}