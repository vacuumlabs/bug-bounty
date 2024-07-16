import Image from 'next/image'

import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import backgroundImage from '@public/images/thin-overlay.png'
import {requireJudgeSession} from '@/server/utils/auth'
import JudgeRewardsList, {
  JUDGE_REWARDS_PAGE_SIZE,
} from '@/components/sections/judge/JudgeRewardsList'
import {prefetchGetRewards} from '@/lib/queries/reward/getRewards'

const JudgeContestsPage = async () => {
  await requireJudgeSession()

  await prefetchGetRewards({limit: JUDGE_REWARDS_PAGE_SIZE})

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
        <div className="mx-64 mb-12">
          <JudgeRewardsList />
        </div>
      </HydrationBoundary>
    </main>
  )
}

export default JudgeContestsPage
