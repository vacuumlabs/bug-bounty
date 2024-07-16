import Image from 'next/image'

import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import backgroundImage from '@public/images/thin-overlay.png'
import {requireJudgeSession} from '@/server/utils/auth'
import JudgeContestOverview from '@/components/sections/judge/JudgeContestOverview'
import {prefetchGetJudgeContestCounts} from '@/lib/queries/contest/getJudgeContestCounts'
import {prefetchGetJudgeContests} from '@/lib/queries/contest/getJudgeContests'
import JudgeContests, {
  JUDGE_CONTESTS_PAGE_SIZE,
} from '@/components/sections/judge/JudgeContests'

const MyProjectsPage = async () => {
  await requireJudgeSession()

  await Promise.all([
    prefetchGetJudgeContestCounts(),
    prefetchGetJudgeContests({
      type: undefined,
      status: undefined,
      pageParams: {
        limit: JUDGE_CONTESTS_PAGE_SIZE,
        offset: 0,
      },
      sort: undefined,
    }),
  ])

  return (
    <main className="mt-12 flex flex-grow flex-col">
      <Image
        src={backgroundImage}
        alt="Background image"
        width={514}
        style={{
          position: 'absolute',
          right: 0,
          top: -136,
          zIndex: -1,
        }}
      />
      <h1 className="mx-24 mb-6 text-headlineS uppercase">contests overview</h1>
      <HydrationBoundary>
        <JudgeContestOverview className="mx-24 mb-12" />
        <JudgeContests />
      </HydrationBoundary>
    </main>
  )
}

export default MyProjectsPage
