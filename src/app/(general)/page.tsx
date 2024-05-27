import Link from 'next/link'
import Image from 'next/image'
import {ArrowRight} from 'lucide-react'

import backgroundImage from '@public/images/background-graphic.png'
import {Button} from '@/components/ui/Button'
import {prefetchGetPublicContests} from '@/lib/queries/contest/getPublicContests'
import {prefetchGetPublicContestCounts} from '@/lib/queries/contest/getPublicContestCounts'
import {ContestOccurence} from '@/server/db/models'
import HomePageTabs, {
  HOMEPAGE_CONTESTS_PAGE_SIZE,
} from '@/components/sections/home/HomePageTabs'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'

const Home = async () => {
  await Promise.all([
    prefetchGetPublicContests({
      type: ContestOccurence.PRESENT,
      offset: 0,
      limit: HOMEPAGE_CONTESTS_PAGE_SIZE,
      projectCategory: [],
      projectLanguage: [],
    }),
    prefetchGetPublicContestCounts({
      projectCategory: [],
      projectLanguage: [],
    }),
  ])

  return (
    <main className="relative flex flex-col justify-between pt-[200px]">
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
      <div className="flex flex-col px-24">
        <div className="mb-[236px] flex flex-col items-start gap-6">
          <h1 className="whitespace-pre-line text-headlineL font-normal uppercase">
            {'Join the Bounty Lab and\n'}
            <span className="font-bold">
              {'shape the future of\nCardano Security.'}
            </span>
          </h1>
          <Button asChild>
            <Link href="/contests">
              {'Explore bounties'}
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
      <HydrationBoundary>
        <HomePageTabs />
      </HydrationBoundary>
    </main>
  )
}

export default Home
