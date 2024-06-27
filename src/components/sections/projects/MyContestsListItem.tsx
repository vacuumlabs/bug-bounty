import Link from 'next/link'
import {ArrowRight} from 'lucide-react'
import removeMarkdown from 'remove-markdown'
import {useMemo} from 'react'
import {DateTime} from 'luxon'

import ContestStatusBadge from '../contest/ContestStatusBadge'
import ListItemStyledValueText from './ListItemStyledValueText'

import {Button} from '@/components/ui/Button'
import {ContestStatus} from '@/server/db/models'
import {ellipsizeText, formatAda, formatDate} from '@/lib/utils/common/format'
import type {ContestWithFindingCounts} from '@/server/actions/contest/getMyContests'
import {PATHS} from '@/lib/utils/common/paths'
import {useGetDeduplicatedFindingsCount} from '@/lib/queries/deduplicatedFinding/getDeduplicatedFinding'

type MyContestsListItemProps = {
  contest: ContestWithFindingCounts
}

const MyContestsListItem = ({contest}: MyContestsListItemProps) => {
  const {data: deduplicatedFindingsCount} = useGetDeduplicatedFindingsCount(
    contest.id,
    {
      enabled: contest.status === ContestStatus.FINISHED,
    },
  )

  const leftValues = useMemo(() => {
    const isActiveContest =
      DateTime.fromJSDate(contest.startDate) < DateTime.now() &&
      (contest.status === ContestStatus.APPROVED ||
        contest.status === ContestStatus.FINISHED)

    if (contest.status === ContestStatus.FINISHED) {
      return [
        {
          label: 'Start day',
          value: formatDate(contest.startDate, DateTime.DATETIME_MED),
        },
        {
          label: 'End day',
          value: formatDate(contest.endDate, DateTime.DATETIME_MED),
        },
      ]
    }

    return isActiveContest
      ? [
          {
            label: 'Open reports',
            value: contest.pendingFindingsCount,
          },
          {
            label: 'Approved',
            value: contest.approvedFindingsCount,
          },
          {
            label: 'Rejected',
            value: contest.rejectedFindingsCount,
          },
        ]
      : []
  }, [contest])

  const rightValues = useMemo(() => {
    if (contest.status === ContestStatus.FINISHED) {
      return [
        {
          label: 'Vulnerabilities found',
          value: deduplicatedFindingsCount?.count ?? '-',
        },
      ]
    }

    const startDate = DateTime.fromJSDate(contest.startDate)
    const endDate = DateTime.fromJSDate(contest.endDate)
    const relevantDate = DateTime.now() < startDate ? startDate : endDate

    const getDateLabel = () => {
      if (DateTime.now() < startDate) {
        return 'Starts'
      }
      if (DateTime.now() < endDate) {
        return 'Ends'
      }
      return 'Ended'
    }

    return [
      {
        label: 'Rewards',
        value: formatAda(contest.rewardsAmount),
      },
      {
        label: getDateLabel(),
        value: relevantDate.toRelative({locale: 'en'}),
      },
    ]
  }, [contest, deduplicatedFindingsCount])

  return (
    <div className="flex flex-col bg-grey-90 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-titleL">{contest.title}</span>
          <ContestStatusBadge contest={contest} />
        </div>
        <Button variant="outline" asChild>
          <Link
            href={
              contest.status === ContestStatus.FINISHED
                ? `${PATHS.myProjectDetails(contest.id)}?view=vulnerabilities`
                : PATHS.myProjectDetails(contest.id)
            }
            className="gap-2">
            Show details
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <p className="max-w-screen-lg">
        {ellipsizeText(removeMarkdown(contest.description), 300)}
      </p>
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {leftValues.map((value) => (
            <ListItemStyledValueText key={value.label} {...value} />
          ))}
        </div>
        <div className="flex items-center gap-6">
          {rightValues.map((value) => (
            <ListItemStyledValueText key={value.label} {...value} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyContestsListItem
