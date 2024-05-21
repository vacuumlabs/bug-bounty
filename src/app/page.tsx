import Link from 'next/link'
import Image from 'next/image'
import {ArrowRight} from 'lucide-react'

import backgroundImage from '@public/images/background-graphic.png'
import overlayImage from '@public/images/how-it-works-overlay.png'
import {Button} from '@/components/ui/Button'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import {prefetchGetPublicContests} from '@/lib/queries/contest/getContests'
import {prefetchGetPublicContestCounts} from '@/lib/queries/contest/getPublicContestCounts'
import {ContestOccurence} from '@/server/db/models'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {Separator} from '@/components/ui/Separator'
import Contests from '@/components/sections/contest/Contests'
import HowItWorks from '@/components/sections/contest/HowItWorks'

const CONTESTS_PER_PAGE = 7

const Home = async () => {
  await Promise.all([
    prefetchGetPublicContests({
      type: ContestOccurence.PRESENT,
      offset: 0,
      limit: CONTESTS_PER_PAGE,
    }),
    prefetchGetPublicContestCounts(),
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
          <h1 className="whitespace-pre-line text-5xl uppercase">
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
        <Tabs value="hunters">
          <TabsList>
            <TabsTrigger className="text-base" value="hunters">
              For hunters
            </TabsTrigger>
            <TabsTrigger className="text-base" value="projects">
              For projects
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Separator className="h-[0.5px]" />
      <div className="bg-black px-24 pb-[108px] pt-16">
        <HydrationBoundary>
          <Contests pageSize={CONTESTS_PER_PAGE} />
        </HydrationBoundary>
      </div>
      <div className="relative overflow-hidden bg-white/5 p-24">
        <Image
          src={overlayImage}
          className="absolute right-0 top-0"
          alt="Overlay graphic"
          width={514}
          height={700}
        />
        <HowItWorks />
      </div>
    </main>
  )
}

export default Home
