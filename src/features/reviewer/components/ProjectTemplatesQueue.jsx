import { useState } from 'react';
import { usePendingTemplates } from '../hooks/usePendingTemplates';
import { useReviewProjectTemplate } from '../hooks/useReviewMutations';
import { ReviewActionModal } from './ReviewActionModal';
import { TemplateDetailModal } from './TemplateDetailModal';
import { 
  Layers, Calendar, Eye, Check, X, 
  ChevronLeft, ChevronRight, AlertCircle, Clock, GraduationCap 
} from 'lucide-react';

export function ProjectTemplatesQueue() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const { templates, paginatedResult, isLoading, error, refetch } = usePendingTemplates(pageNumber, pageSize);
  const reviewMutation = useReviewProjectTemplate();

  const [detailModalTemplateId, setDetailModalTemplateId] = useState(null);
  const [reviewModalState, setReviewModalState] = useState({
    isOpen: false,
    template: null,
    isApproved: true,
  });
  const [mutationError, setMutationError] = useState(null);

  const totalPages = paginatedResult?.totalPages || 1;
  const hasPreviousPage = paginatedResult?.hasPreviousPage ?? pageNumber > 1;
  const hasNextPage = paginatedResult?.hasNextPage ?? pageNumber < totalPages;

  const handleOpenReview = (template, isApproved) => {
    setMutationError(null);
    setReviewModalState({ isOpen: true, template, isApproved });
  };

  const handleCloseReview = () => {
    if (reviewMutation.isPending) return;
    setReviewModalState({ isOpen: false, template: null, isApproved: true });
    setMutationError(null);
  };

  const handleReviewSubmit = async ({ isApproved, rejectionReason }) => {
    if (!reviewModalState.template) return;
    setMutationError(null);

    try {
      await reviewMutation.mutateAsync({
        templateId: reviewModalState.template.id,
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
        <span>
          Showing <strong className="text-slate-800">{templates.length}</strong> of{' '}
          <strong className="text-slate-800">{paginatedResult?.totalCount ?? templates.length}</strong> pending templates
        </span>
        <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 font-semibold">
          <Clock size={13} /> Pending Review
        </span>
      </div>

      {templates.length === 0 ? (
        <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 space-y-2">
          <Layers size={32} className="mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No pending project templates</p>
          <p className="text-xs">There are no project template blueprints awaiting evaluation at this time.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Template Title & Overview</th>
                <th className="py-3 px-4">Academic Alignment</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {templates.map((template) => {
                const submissionDate = template.submittedAt || template.createdAt;
                return (
                  <tr key={template.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold shrink-0 mt-0.5">
                          <Layers size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm line-clamp-1">{template.title}</div>
                          <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5 leading-relaxed">
                            {template.description || 'No detailed summary provided.'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {template.majorName ? (
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                            <GraduationCap size={12} />
                            <span>{template.majorName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">General Academic Track</span>
                        )}
                        {template.specialtyName && (
                          <div className="text-[11px] text-slate-500 font-medium">
                            Specialty: <span className="text-slate-700 font-semibold">{template.specialtyName}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{submissionDate ? new Date(submissionDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailModalTemplateId(template.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Inspect structure, milestones, tasks, and skills"
                        >
                          <Eye size={14} className="text-slate-500" />
                          <span>Inspect</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenReview(template, true)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Approve Project Template"
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenReview(template, false)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Reject Project Template"
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

      <TemplateDetailModal
        templateId={detailModalTemplateId}
        isOpen={!!detailModalTemplateId}
        onClose={() => setDetailModalTemplateId(null)}
        onApprove={(tpl) => {
          setDetailModalTemplateId(null);
          handleOpenReview(tpl, true);
        }}
        onReject={(tpl) => {
          setDetailModalTemplateId(null);
          handleOpenReview(tpl, false);
        }}
      />

      <ReviewActionModal
        isOpen={reviewModalState.isOpen}
        onClose={handleCloseReview}
        onSubmit={handleReviewSubmit}
        isApproved={reviewModalState.isApproved}
        targetTitle={reviewModalState.template?.title}
        isSubmitting={reviewMutation.isPending}
        error={mutationError}
      />
    </div>
  );
}