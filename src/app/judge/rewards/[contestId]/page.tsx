import Image from 'next/image'

import backgroundImage from '@public/images/thin-overlay.png'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import {requireJudgeSession} from '@/server/utils/auth'
import JudgeRewardsPayoutTable, {
  JUDGE_REWARDS_PAYOUT_PAGE_SIZE,
} from '@/components/sections/judge/JudgeRewardsPayoutTable'
import {prefetchGetRewardsPayout} from '@/lib/queries/reward/getRewards'

const JudgeFindingPage = async ({params}: {params: {contestId: string}}) => {
  await requireJudgeSession()

  await prefetchGetRewardsPayout({
    contestId: params.contestId,
    pageParams: {limit: JUDGE_REWARDS_PAYOUT_PAGE_SIZE, offset: 0},
    sort: undefined,
  })

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
      <HydrationBoundary>
        <div className="flex flex-grow flex-col bg-black px-24 pb-24">
          <JudgeRewardsPayoutTable contestId={params.contestId} />
        </div>
      </HydrationBoundary>
    </main>
  )
}

export default JudgeFindingPage
