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
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {Separator} from '@/components/ui/Separator'
import Contests from '@/components/sections/contest/Contests'
import HowItWorks from '@/components/sections/contest/HowItWorks'
import Footer from '@/components/global/Footer'

const CONTESTS_PER_PAGE = 7

const Home = async () => {
  await Promise.all([
    prefetchGetPublicContests({
      type: ContestOccurence.PRESENT,
      offset: 0,
      limit: CONTESTS_PER_PAGE,
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
          <h1 className="whitespace-pre-line text-displayM font-normal uppercase">
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
      <Tabs defaultValue="hunters">
        <TabsList className="px-24">
          <TabsTrigger className="text-bodyM" value="hunters">
            For hunters
          </TabsTrigger>
          <TabsTrigger className="text-bodyM" value="projects">
            For projects
          </TabsTrigger>
        </TabsList>
        <Separator className="h-[0.5px]" />
        <TabsContent value="hunters">
          <div className="bg-black px-24 pb-[108px] pt-16">
            <HydrationBoundary>
              <Contests pageSize={CONTESTS_PER_PAGE} />
            </HydrationBoundary>
          </div>
          <div className="relative overflow-hidden bg-white/5 p-24">
            <Image
              src={overlayImage}
              className="pointer-events-none absolute right-0 top-0 h-auto"
              alt="Overlay graphic"
              width={514}
            />
            <HowItWorks />
          </div>
          <div className="p-24">
            <div className="relative flex flex-col items-center overflow-hidden rounded-full bg-purple p-11 text-black">
              <Image
                src={overlayImage}
                className="absolute -right-24 top-0 h-auto"
                alt="Overlay graphic"
                width={514}
              />
              <h3 className="text-displayS uppercase">Still wondering?</h3>
              {/*TODO: add text */}
              <p className="mb-11 mt-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                porttitor metus a felis bibendum, cursus dictum dolor
                pellentesque. Proin aliquet in tellus vel vestibulum.
              </p>
              <div className="flex gap-3">
                <Button asChild variant="outline" className="text-black">
                  {/*TODO: add link */}
                  <Link href="#">Talk with an expert</Link>
                </Button>
                <Button asChild variant="default">
                  <Link href="/contests" className="gap-2">
                    Explore bounties
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Footer />
    </main>
  )
}

export default Home
