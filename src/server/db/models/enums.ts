export enum UserRole {
  JUDGE = 'judge',
  AUDITOR = 'auditor',
  PROJECT_OWNER = 'project_owner',
}

export enum ContestStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FINISHED = 'FINISHED',
}

export enum ContestOccurence {
  PAST = 'past',
  PRESENT = 'present',
  FUTURE = 'future',
}

export enum ContestView {
  DETAILS = 'details',
  LEADERBOARD = 'leaderboard',
}

export enum MyProjectDetailsView {
  DETAILS = 'details',
  VULNERABILITIES = 'vulnerabilities',
}

export enum FindingOccurence {
  PAST = 'past',
  PRESENT = 'present',
}

export enum FindingSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum FindingStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export enum JudgeFindingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum JudgeDeduplicatedFindingTab {
  REPORTS = 'REPORTS',
  ADD_FINDINGS = 'ADD_FINDINGS',
}

export enum ProjectLanguage {
  AIKEN = 'AIKEN',
  PLUTARCH = 'PLUTARCH',
  PLUTUS = 'PLUTUS',
  OTHER = 'OTHER',
}

export enum ProjectCategory {
  BLOCKCHAIN = 'BLOCKCHAIN',
  DEFI = 'DEFI',
  EXCHANGE = 'EXCHANGE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  NFT = 'NFT',
  OTHER = 'OTHER',
}
