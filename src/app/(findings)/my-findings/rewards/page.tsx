import Image from 'next/image'

import {requirePageSession} from '@/server/utils/auth'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import backgroundImage from '@public/images/thin-overlay.png'
import Separator from '@/components/ui/Separator'
import MyFindingsRewardsTable, {
  MY_FINDINGS_REWARDS_PAGE_SIZE,
} from '@/components/sections/finding/rewards/MyFindingsRewardsTable'
import {
  prefetchGetMyFindingsRewards,
  prefetchGetMyFindingsRewardsSize,
} from '@/lib/queries/reward/getMyFindingsRewards'

const myFindingsRewardsPage = async () => {
  const {user} = await requirePageSession()

  await Promise.all([
    prefetchGetMyFindingsRewards(user.id, {
      limit: MY_FINDINGS_REWARDS_PAGE_SIZE,
    }),
    prefetchGetMyFindingsRewardsSize(user.id),
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
      <h1 className="mx-24 mb-12 text-headlineS uppercase">My Rewards</h1>
      <Separator />
      <HydrationBoundary>
        <div className="mx-24 mt-12">
          <MyFindingsRewardsTable />
        </div>
      </HydrationBoundary>
    </main>
  )
}

export default myFindingsRewardsPage
