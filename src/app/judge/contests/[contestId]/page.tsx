import Image from 'next/image'

import backgroundImage from '@public/images/thin-overlay.png'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import MyProjectDetails from '@/components/sections/projects/MyProjectDetails'
import {prefetchGetContest} from '@/lib/queries/contest/getContest'
import {
  prefetchGetDeduplicatedFindings,
  prefetchGetDeduplicatedFindingsCount,
} from '@/lib/queries/deduplicatedFinding/getDeduplicatedFinding'
import {MY_PROJECT_VULNERABILITIES_PAGE_SIZE} from '@/components/sections/projects/MyProjectVulnerabilitiesList'
import {requireJudgeSession} from '@/server/utils/auth'

const JudgeContestDetailPage = async ({
  params,
}: {
  params: {contestId: string}
}) => {
  await requireJudgeSession()

  await Promise.all([
    prefetchGetContest(params.contestId),
    prefetchGetDeduplicatedFindings({
      contestId: params.contestId,
      pageParams: {
        limit: MY_PROJECT_VULNERABILITIES_PAGE_SIZE,
        offset: 0,
      },
      sort: undefined,
    }),
    prefetchGetDeduplicatedFindingsCount(params.contestId),
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
        <MyProjectDetails contestId={params.contestId} />
      </HydrationBoundary>
    </main>
  )
}

export default JudgeContestDetailPage
