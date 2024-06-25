'use client'

import ContestLeaderboard from './ContestLeaderboard'
import ContestDetails from './ContestInfo'

import Separator from '@/components/ui/Separator'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {useSearchParamsEnumState} from '@/lib/hooks/useSearchParamsState'
import {ContestView, ContestStatus} from '@/server/db/models'
import {Contest} from '@/server/actions/contest/getContest'

type ContestDetailBodyProps = {
  contest: Contest
}

const ContestDetailBody = ({contest}: ContestDetailBodyProps) => {
  const [contestView, {setValue: setContestView}] = useSearchParamsEnumState(
    'view',
    ContestView,
    ContestView.DETAILS,
  )

  return (
    <div className="mt-12 flex flex-grow flex-col">
      <Tabs
        value={contestView}
        onValueChange={setContestView}
        className="flex flex-grow flex-col">
        <TabsList className="self-start px-24">
          {contest.status === ContestStatus.FINISHED && (
            <TabsTrigger value={ContestView.LEADERBOARD} className="uppercase">
              leaderboard
            </TabsTrigger>
          )}
          <TabsTrigger value={ContestView.DETAILS} className="uppercase">
            audit details
          </TabsTrigger>
        </TabsList>
        <Separator />
        <div className="flex flex-grow flex-col bg-black px-24 pb-24 pt-12">
          <TabsContent value={ContestView.DETAILS}>
            <ContestDetails contest={contest} />
          </TabsContent>
          <TabsContent value={ContestView.LEADERBOARD}>
            <ContestLeaderboard contestId={contest.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default ContestDetailBody
