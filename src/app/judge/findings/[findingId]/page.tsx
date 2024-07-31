import Image from 'next/image'

import backgroundImage from '@public/images/thin-overlay.png'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import {requireJudgeSession} from '@/server/utils/auth'
import {prefetchGetFinding} from '@/lib/queries/finding/getFinding'
import MyProjectVulnerabilityReport from '@/components/sections/projects/MyProjectVulnerabilityReport'

const JudgeFindingPage = async ({params}: {params: {findingId: string}}) => {
  await requireJudgeSession()

  await prefetchGetFinding({findingId: params.findingId})

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
        <MyProjectVulnerabilityReport findingId={params.findingId} />
      </HydrationBoundary>
    </main>
  )
}

export default JudgeFindingPage
