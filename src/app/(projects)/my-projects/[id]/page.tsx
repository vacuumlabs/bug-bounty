import Image from 'next/image'

import backgroundImage from '@public/images/thin-overlay.png'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import MyProjectDetails from '@/components/sections/projects/MyProjectDeailts'
import {prefetchGetContest} from '@/lib/queries/contest/getContest'
import {
  prefetchGetDeduplicatedFindings,
  prefetchGetDeduplicatedFindingsCount,
} from '@/lib/queries/deduplicatedFinding/getDeduplicatedFinding'

const MyProjectDetailPage = async ({params}: {params: {id: string}}) => {
  await Promise.all([
    prefetchGetContest(params.id),
    prefetchGetDeduplicatedFindings({contestId: params.id}),
    prefetchGetDeduplicatedFindingsCount(params.id),
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
      <HydrationBoundary>
        <MyProjectDetails contestId={params.id} />
      </HydrationBoundary>
    </main>
  )
}

export default MyProjectDetailPage
