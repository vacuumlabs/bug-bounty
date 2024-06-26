'use client'

import ContestInfo from '../contest/ContestDetails/ContestInfo'
import MyProjectVulnerabilitiesList from './MyProjectVulnerabilitiesList'

import Separator from '@/components/ui/Separator'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {useSearchParamsEnumState} from '@/lib/hooks/useSearchParamsState'
import {ContestStatus, MyProjectDetailsView} from '@/server/db/models'
import {Contest} from '@/server/actions/contest/getContest'

type MyProjectDetailsBodyProps = {
  contest: Contest
}

const MyProjectDetailsBody = ({contest}: MyProjectDetailsBodyProps) => {
  const [myProjectDetailsView, {setValue: setMyProjectDetailsView}] =
    useSearchParamsEnumState(
      'view',
      MyProjectDetailsView,
      MyProjectDetailsView.DETAILS,
    )

  return (
    <div className="mt-12 flex flex-grow flex-col">
      <Tabs
        value={myProjectDetailsView}
        onValueChange={setMyProjectDetailsView}
        className="flex flex-grow flex-col">
        <TabsList className="self-start px-24">
          {contest.status === ContestStatus.FINISHED && (
            <TabsTrigger
              value={MyProjectDetailsView.VULNERABILITIES}
              className="uppercase">
              vulnerabilities
            </TabsTrigger>
          )}
          <TabsTrigger
            value={MyProjectDetailsView.DETAILS}
            className="uppercase">
            audit details
          </TabsTrigger>
        </TabsList>
        <Separator />
        <div className="flex flex-grow flex-col bg-black px-24 pb-24 pt-12">
          <TabsContent value={MyProjectDetailsView.DETAILS}>
            <ContestInfo contest={contest} isMyContest />
          </TabsContent>
          <TabsContent value={MyProjectDetailsView.VULNERABILITIES}>
            <MyProjectVulnerabilitiesList contestId={contest.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default MyProjectDetailsBody
