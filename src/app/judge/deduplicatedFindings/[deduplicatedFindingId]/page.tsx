import Image from 'next/image'

import backgroundImage from '@public/images/thin-overlay.png'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import {requireJudgeSession} from '@/server/utils/auth'
import {
  prefetchGetFindings,
  prefetchGetFindingsToDeduplicate,
} from '@/lib/queries/finding/getFinding'
import {prefetchGetDeduplicatedFinding} from '@/lib/queries/deduplicatedFinding/getDeduplicatedFinding'
import JudgeDeduplicatedFinding from '@/components/sections/judge/JudgeDeduplicatedFinding'
import {JUDGE_FINDINGS_TO_DEDUPLICATE_PAGE_SIZE} from '@/components/sections/judge/JudgeAddDeduplicatedFinding'

const JudgeFindingPage = async ({
  params,
}: {
  params: {deduplicatedFindingId: string}
}) => {
  await requireJudgeSession()

  await Promise.all([
    prefetchGetFindings({
      deduplicatedFindingId: params.deduplicatedFindingId,
    }),
    prefetchGetDeduplicatedFinding(params.deduplicatedFindingId),
    prefetchGetFindingsToDeduplicate({
      deduplicatedFindingId: params.deduplicatedFindingId,
      pageParams: {
        limit: JUDGE_FINDINGS_TO_DEDUPLICATE_PAGE_SIZE,
        offset: 0,
      },
      sort: undefined,
    }),
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
        <JudgeDeduplicatedFinding
          deduplicatedFindingId={params.deduplicatedFindingId}
        />
      </HydrationBoundary>
    </main>
  )
}

export default JudgeFindingPage
