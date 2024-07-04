import Image from 'next/image'

import backgroundImage from '@public/images/background-graphic.png'
import {prefetchGetContest} from '@/lib/queries/contest/getContest'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import ContestDetails from '@/components/sections/contest/ContestDetails/ContestDetails'
import {prefetchGetContestLeaderboard} from '@/lib/queries/contest/getContestLeaderboard'
import {CONTEST_LEADERBOARD_PAGE_SIZE} from '@/components/sections/contest/ContestDetails/ContestLeaderboard'

const ContestDetailPage = async ({params}: {params: {id: string}}) => {
  await Promise.all([
    prefetchGetContest(params.id),
    prefetchGetContestLeaderboard({
      contestId: params.id,
      offset: 0,
      limit: CONTEST_LEADERBOARD_PAGE_SIZE,
    }),
  ])

  return (
    <main className="relative pb-24 pt-12">
      <Image
        src={backgroundImage}
        alt="Background image"
        width={514}
        className="opacity-10"
        style={{
          position: 'absolute',
          right: 0,
          top: -136,
          zIndex: -1,
        }}
      />
      <HydrationBoundary>
        <ContestDetails contestId={params.id} />
      </HydrationBoundary>
    </main>
  )
}

export default ContestDetailPage
