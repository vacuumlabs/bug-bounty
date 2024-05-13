import Link from 'next/link'

import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import {prefetchGetPublicContests} from '@/lib/queries/contest/getContests'
import Contests from '@/components/sections/contest/Contests'
import {ContestOccurence} from '@/server/db/models'
import {prefetchGetPublicContestCounts} from '@/lib/queries/contest/getPublicContestCounts'

const ContestsPage = async () => {
  await Promise.all([
    prefetchGetPublicContests({type: ContestOccurence.PRESENT}),
    prefetchGetPublicContestCounts(),
  ])

  return (
    <main className="flex flex-grow flex-col">
      <div className="flex flex-col bg-white px-20 pb-[60px] pt-[133px]">
        <div className="flex items-center gap-9">
          <span className="bg-slate-200 px-5 py-2 text-3xl font-semibold">
            For Hunters
          </span>
          <Link className="text-3xl" href="/projects">
            For Projects
          </Link>
        </div>
        <h1 className="mb-20 mt-12 whitespace-pre-line text-3xl font-semibold">
          {'Join the Bounty Lab and shape\nthe future of Crypto Security.'}
        </h1>
      </div>
      <div className="flex flex-grow flex-col bg-slate-300 px-20 pb-20 pt-7">
        <h2 className="mb-1.5 text-3xl font-medium">Bounties</h2>
        <HydrationBoundary>
          <Contests />
        </HydrationBoundary>
      </div>
    </main>
  )
}

export default ContestsPage
