'use client'

import Link from 'next/link'
import {DateTime} from 'luxon'

import cardanoLogo from '@public/images/cardano-logo.png'
import {Avatar, AvatarImage} from '@/components/ui/Avatar'
import {Button} from '@/components/ui/Button'
import {PATHS} from '@/lib/utils/common/paths'
import {translateEnum} from '@/lib/utils/common/enums'
import {formatAda, formatTimeRemaining} from '@/lib/utils/common/format'
import {Contest} from '@/server/actions/contest/getContest'
import {getContestStatus} from '@/lib/utils/common/contest'

type ContestOverviewProps = {
  contest: Contest
}

const ContestOverview = ({contest}: ContestOverviewProps) => {
  const projectType = translateEnum.projectCategory(contest.projectCategory)
  const projectLanguage = translateEnum.projectLanguage(contest.projectLanguage)

  return (
    <div className="px-24">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-6">
          <Avatar>
            <AvatarImage src={cardanoLogo.src} />
          </Avatar>
          <span className="text-headlineS text-white">{contest.title}</span>
        </div>
        <div className="flex items-center gap-6">
          <Button variant="default" size="medium" asChild>
            <Link href={PATHS.newFinding}>Submit Report</Link>
          </Button>
          <Button variant="outline" size="medium" asChild>
            <Link href={contest.repoUrl} target="_blank">
              View Repo
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-4 grid-rows-2 gap-6">
        {contest.endDate < new Date() ? (
          <div className="row-span-2 flex h-[296px] flex-col justify-between bg-grey-90 p-6">
            <h2 className="text-titleM">Status</h2>
            <span className="text-headlineS capitalize">
              {getContestStatus({
                startDate: contest.startDate,
                endDate: contest.endDate,
                status: contest.status,
              })}
            </span>
          </div>
        ) : (
          <div className="row-span-2 flex h-[296px] flex-col justify-between bg-grey-90 p-6">
            <h2 className="text-titleM">Remaining Time</h2>
            <span className="text-headlineS">
              {formatTimeRemaining(contest.endDate)}
            </span>
          </div>
        )}
        <div className="row-span-2 flex h-[296px] flex-col justify-between bg-grey-90 p-6">
          <h2 className="text-titleM">Total Rewards</h2>
          <span className="text-headlineS">
            {formatAda(contest.rewardsAmount)}
          </span>
        </div>
        <div className="flex h-[136px] flex-col justify-between bg-grey-90 p-6">
          <h2 className="text-titleM">Start Day</h2>
          <span className="text-titleM">
            {DateTime.fromJSDate(contest.startDate).toLocaleString(
              DateTime.DATETIME_MED,
              {locale: 'en'},
            )}
          </span>
        </div>
        <div className="flex h-[136px] flex-col justify-between bg-grey-90 p-6">
          <h2 className="text-titleM">Project Type</h2>
          <span className="text-titleM">{projectType}</span>
        </div>
        <div className="flex h-[136px] flex-col justify-between bg-grey-90 p-6">
          <h2 className="text-titleM">End Day</h2>
          <span className="text-titleM">
            {DateTime.fromJSDate(contest.endDate).toLocaleString(
              DateTime.DATETIME_MED,
              {locale: 'en'},
            )}
          </span>
        </div>
        <div className="flex h-[136px] flex-col justify-between bg-grey-90 p-6">
          <h2 className="text-titleM">Language</h2>
          <span className="text-titleM">{projectLanguage}</span>
        </div>
      </div>
    </div>
  )
}

export default ContestOverview
