export enum UserRole {
  JUDGE = 'judge',
  AUDITOR = 'auditor',
}

export enum ContestStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  FINISHED = 'FINISHED',
}

export enum ContestOccurence {
  PAST = 'past',
  PRESENT = 'present',
  FUTURE = 'future',
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
