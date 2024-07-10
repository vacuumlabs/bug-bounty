export enum HomePageTab {
  HUNTERS = 'hunters',
  PROJECTS = 'projects',
}

export enum AboutUsTab {
  HUNTERS = 'for-hunters',
  PROJECTS = 'for-projects',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ContestSorting {
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  REWARDS_AMOUNT = 'rewardsAmount',
  TITLE = 'title',
}

export enum MyFindingsSorting {
  PROJECT = 'project',
  FINDING = 'finding',
  SUBMITTED = 'submitted',
  SEVERITY = 'severity',
  PROJECT_STATE = 'projectState',
  STATUS = 'status',
}

export enum MyFindingsRewardsSorting {
  PROJECT = 'project',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
  SEVERITY = 'severity',
  REWARD = 'reward',
  STATE = 'state',
}

export enum MyProjectVulnerabilitiesSorting {
  VULNERABILITY = 'vulnerability',
  FOUND_BY = 'foundBy',
  SEVERITY = 'severity',
}

export enum ContestStatusText {
  draft = 'draft',
  rejected = 'rejected',
  finished = 'finished',
  notApproved = 'notApproved',
  inReview = 'inReview',
  pending = 'pending',
  judging = 'judging',
  live = 'live',
  approved = 'approved',
}
