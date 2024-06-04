import Image from 'next/image'

import backgroundImage from '@public/images/background-graphic.png'
import {prefetchGetPublicContests} from '@/lib/queries/contest/getPublicContests'
import {prefetchGetPublicContestCounts} from '@/lib/queries/contest/getPublicContestCounts'
import {ContestOccurence} from '@/server/db/models'
import HomePageTabs, {
  HOMEPAGE_CONTESTS_PAGE_SIZE,
} from '@/components/sections/home/HomePageTabs'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import HomePageCtaButton from '@/components/sections/home/HomePageCtaButton'
import KnowledgeBase from '@/components/sections/home/KnowledgeBase'
import {getArticlesFeed} from '@/server/loaders/getArticlesFeed'

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

  const feed = await getArticlesFeed()

  return (
    <main className="relative flex flex-col justify-between pb-24 pt-[200px]">
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
          <HomePageCtaButton />
        </div>
      </div>
      <HydrationBoundary>
        <HomePageTabs />
        <KnowledgeBase articles={feed.items} defaultImageUrl={feed.image.url} />
      </HydrationBoundary>
    </main>
  )
}

export default Home
