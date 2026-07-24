import { useState } from 'react';

/**
 * Custom hook to encapsulate reviewer queue state:
 * - Pagination state (pageNumber)
 * - Detail modal selection state (detailModalId)
 * - Review modal state (isOpen, item, isApproved)
 * - Mutation error handling
 */
export function useQueueReviewState() {
  const [pageNumber, setPageNumber] = useState(1);
  const [detailModalId, setDetailModalId] = useState(null);
  const [mutationError, setMutationError] = useState(null);

  const [reviewModalState, setReviewModalState] = useState({
    isOpen: false,
    item: null,
    isApproved: true,
  });

  const openReview = (item, isApproved) => {
    setMutationError(null);
    setReviewModalState({ isOpen: true, item, isApproved });
  };

  const closeReview = (isPending = false) => {
    if (isPending) return;
    setReviewModalState({ isOpen: false, item: null, isApproved: true });
    setMutationError(null);
  };

  const openDetail = (id) => {
    setDetailModalId(id);
  };

  const closeDetail = () => {
    setDetailModalId(null);
  };

  const handleDetailApprove = (item) => {
    closeDetail();
    openReview(item, true);
  };

  const handleDetailReject = (item) => {
    closeDetail();
    openReview(item, false);
  };

  const submitReview = async ({ isApproved, rejectionReason }, reviewFn, refetch) => {
    if (!reviewModalState.item) return;
    setMutationError(null);

    try {
      await reviewFn({
        item: reviewModalState.item,
        isApproved,
        rejectionReason,
      });
      closeReview();
      if (refetch) {
        refetch();
      }
    } catch (err) {
      setMutationError(
        err.response?.data?.message || err.message || 'Failed to submit review decision. Please try again.'
      );
    }
  };

  return {
    pageNumber,
    setPageNumber,
    detailModalId,
    openDetail,
    closeDetail,
    reviewModalState,
    openReview,
    closeReview,
    handleDetailApprove,
    handleDetailReject,
    mutationError,
    setMutationError,
    submitReview,
  };
}