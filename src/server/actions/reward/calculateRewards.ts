'use server'

import {isFuture} from 'date-fns'

import {db} from '../../db'
import {Finding} from '../../db/schema/finding'
import {InsertReward} from '../../db/schema/reward'
import {requireJudgeAuth} from '../../utils/auth'
import {ContestStatus, FindingSeverity, FindingStatus} from '../../db/models'

import {ContestSeverityWeights} from '@/server/db/schema/contestSeverityWeights'

type CustomSeverityWeights = Pick<
  ContestSeverityWeights,
  'info' | 'low' | 'medium' | 'high' | 'critical'
>

const BEST_REPORT_BONUS = 0.3 // 30%

const defaultSeverityWeights: Record<FindingSeverity, number> = {
  [FindingSeverity.CRITICAL]: 36,
  [FindingSeverity.HIGH]: 9,
  [FindingSeverity.MEDIUM]: 3,
  [FindingSeverity.LOW]: 1,
  [FindingSeverity.INFO]: 0,
}

const getSeverityWeights = (customWeights: CustomSeverityWeights | null) => {
  if (customWeights) {
    return {
      [FindingSeverity.CRITICAL]: customWeights.critical,
      [FindingSeverity.HIGH]: customWeights.high,
      [FindingSeverity.MEDIUM]: customWeights.medium,
      [FindingSeverity.LOW]: customWeights.low,
      [FindingSeverity.INFO]: customWeights.info,
    }
  }

  return defaultSeverityWeights
}

const calculatePointsPerSubmission = (
  severityWeight: number,
  numberOfSubmissions: number,
) => (severityWeight * 0.9 ** (numberOfSubmissions - 1)) / numberOfSubmissions

const getRewardForFinding = (
  finding: Pick<Finding, 'id' | 'authorId'>,
  rewardPerSubmission: number,
  bestFindingId: string | null,
) => {
  const bestReportMultiplier =
    bestFindingId === finding.id ? 1 + BEST_REPORT_BONUS : 1

  return {
    findingId: finding.id,
    userId: finding.authorId,
    amount: Math.floor(bestReportMultiplier * rewardPerSubmission).toFixed(0),
  }
}

export const calculateRewards = async (contestId: string) => {
  await requireJudgeAuth()

  const findings = await db.query.findings.findMany({
    where: (finding, {eq}) => eq(finding.contestId, contestId),
    columns: {
      status: true,
      deduplicatedFindingId: true,
    },
  })

  const hasPendingFindings = findings.some(
    ({status}) => status === FindingStatus.PENDING,
  )
  const hasNoApprovedFindings = !findings.some(
    ({status}) => status === FindingStatus.APPROVED,
  )
  const hasUnassignedFindings = findings.some(
    ({deduplicatedFindingId, status}) =>
      status === FindingStatus.APPROVED && !deduplicatedFindingId,
  )

  if (hasPendingFindings) {
    throw new Error('There are still pending findings in this contest.')
  }
  if (hasNoApprovedFindings) {
    throw new Error('No approved findings found for this contest.')
  }
  if (hasUnassignedFindings) {
    throw new Error(
      'Some approved findings are not assigned to a deduplicated finding.',
    )
  }

  const contest = await db.query.contests.findFirst({
    where: (contests, {eq}) => eq(contests.id, contestId),
    columns: {
      endDate: true,
      rewardsAmount: true,
      status: true,
    },
    with: {
      contestSeverityWeights: true,
      deduplicatedFindings: {
        with: {
          findings: {
            where: (findings, {eq}) =>
              eq(findings.status, FindingStatus.APPROVED),
            columns: {
              id: true,
              authorId: true,
            },
          },
        },
      },
    },
  })

  if (!contest) {
    throw new Error(`Contest with id: ${contestId} not found.`)
  }
  if (isFuture(contest.endDate)) {
    throw new Error(`Contest has not yet ended.`)
  }
  if (contest.status === ContestStatus.FINISHED) {
    throw new Error(`Rewards for this contest were already calculated.`)
  }

  const severityWeights = getSeverityWeights(contest.contestSeverityWeights)

  const findingsWithPoints = contest.deduplicatedFindings
    .map(({severity, findings, bestFindingId}) => ({
      findings,
      bestFindingId,
      pointsPerSubmission: calculatePointsPerSubmission(
        severityWeights[severity],
        findings.length,
      ),
    }))
    .filter(({findings}) => findings.length > 0)

  // assumes whole contest rewards amount is distributed among findings - change if needed to reward judges too
  const totalAwardedPoints = findingsWithPoints.reduce(
    (total, {pointsPerSubmission, findings, bestFindingId}) => {
      const bestReportBonusPoints = bestFindingId
        ? pointsPerSubmission * BEST_REPORT_BONUS
        : 0

      return (
        total + pointsPerSubmission * findings.length + bestReportBonusPoints
      )
    },
    0,
  )

  const rewardPerPoint = Number(contest.rewardsAmount) / totalAwardedPoints

  const rewards = findingsWithPoints.flatMap(
    ({pointsPerSubmission, findings, bestFindingId}) =>
      findings.map((finding) =>
        getRewardForFinding(
          finding,
          pointsPerSubmission * rewardPerPoint,
          bestFindingId,
        ),
      ),
  ) satisfies InsertReward[]

  const totalRewards = rewards.reduce(
    (total, {amount}) => total + Number(amount),
    0,
  )

  if (totalRewards > Number(contest.rewardsAmount)) {
    throw new Error('Total rewards exceed contest rewards amount.')
  }

  return {rewards, totalRewards}
}
