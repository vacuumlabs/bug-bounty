import Image from 'next/image'

import backgroundImage from '@public/images/thin-overlay.png'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import MyProjectVulnerability from '@/components/sections/projects/MyProjectVulnerability'
import {prefetchGetFindings} from '@/lib/queries/finding/getFinding'
import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetDeduplicatedFinding} from '@/lib/queries/deduplicatedFinding/getDeduplicatedFinding'

const MyProjectsVulnerabilityPage = async ({
  params,
}: {
  params: {contestId: string; deduplicatedFindingId: string}
}) => {
  await requirePageSession()

  await Promise.all([
    prefetchGetFindings({
      deduplicatedFindingId: params.deduplicatedFindingId,
    }),
    prefetchGetDeduplicatedFinding(params.deduplicatedFindingId),
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
        <MyProjectVulnerability
          deduplicatedFindingId={params.deduplicatedFindingId}
          contestId={params.contestId}
        />
      </HydrationBoundary>
    </main>
  )
}

export default MyProjectsVulnerabilityPage
