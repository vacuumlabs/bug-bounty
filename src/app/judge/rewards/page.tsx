import Image from 'next/image'

import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import backgroundImage from '@public/images/thin-overlay.png'
import {requireJudgeSession} from '@/server/utils/auth'
import JudgeRewardOverview from '@/components/sections/judge/JudgeRewardOverview'
import {prefetchGetJudgeRewardCounts} from '@/lib/queries/reward/getJudgeRewardCounts'
import JudgeRewardsTable, {
  JUDGE_REWARDS_PAGE_SIZE,
} from '@/components/sections/judge/JudgeRewardsTable'
import {prefetchGetJudgeRewards} from '@/lib/queries/reward/getJudgeRewards'

const JudgeContestsPage = async () => {
  await requireJudgeSession()

  await Promise.all([
    prefetchGetJudgeRewards({
      pageParams: {
        limit: JUDGE_REWARDS_PAGE_SIZE,
        offset: 0,
      },
      sort: undefined,
    }),
    prefetchGetJudgeRewardCounts(),
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
      <h1 className="mx-24 mb-6 text-headlineS uppercase">Rewards</h1>
      <HydrationBoundary>
        <JudgeRewardOverview className="mx-24 mb-12" />
        <div className="px-24 pb-24 pt-8">
          <JudgeRewardsTable />
        </div>
      </HydrationBoundary>
    </main>
  )
}

export default JudgeContestsPage
