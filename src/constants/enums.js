/**
 * AcademicGateway Global Enum Registry
 * All objects are deeply frozen to prevent runtime tampering.
 * Keys use UPPERCASE_SNAKE_CASE; values precisely match backend JsonStringEnumConverter tokens.
 */

// ==========================================
// 1. Common Enums
// ==========================================

export const DeliverableType = Object.freeze({
  NONE: 'None',
  URL: 'Url',
  FILE: 'File',
  TEXT: 'Text',
});

export const DependencyType = Object.freeze({
  FINISH_TO_START: 'FinishToStart',
  START_TO_START: 'StartToStart',
});

// ==========================================
// 2. Project Instance Lifecycle Enums
// ==========================================

export const ProjectInstanceStatus = Object.freeze({
  AWAITING_SUPERVISION: 'AwaitingSupervision',
  ACTIVE: 'Active',
  CONCLUDED: 'Concluded',
  CANCELED: 'Canceled',
});

export const LocalMilestoneStatus = Object.freeze({
  NOT_STARTED: 'NotStarted',
  IN_PROGRESS: 'InProgress',
  SUBMITTED: 'Submitted',
  GRADED: 'Graded',
});

export const LocalTaskStatus = Object.freeze({
  NOT_STARTED: 'NotStarted',
  SUBMITTED: 'Submitted',
  GRADED: 'Graded',
});

// ==========================================
// 3. Matchmaking & Proposal Enums
// ==========================================

export const SupervisionRequestStatus = Object.freeze({
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
});

export const TechSupportProposalStatus = Object.freeze({
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
});

// ==========================================
// 4. Template & Provider Onboarding Enums
// ==========================================

export const ProjectTemplateStatus = Object.freeze({
  DRAFT: 'Draft',
  PENDING_REVIEW: 'PendingReview',
  CHANGES_REQUESTED: 'ChangesRequested',
  PENDING_PROVIDER_ACCEPTANCE: 'PendingProviderAcceptance',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
});

export const ProviderApplicationStatus = Object.freeze({
  DRAFT: 'Draft',
  PENDING_REVIEW: 'PendingReview',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
});