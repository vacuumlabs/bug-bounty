import Image from 'next/image'

import backgroundImage from '@public/images/thin-overlay.png'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import {requireJudgeSession} from '@/server/utils/auth'
import {prefetchGetContestFindings} from '@/lib/queries/finding/getFinding'
import JudgeContestFindings, {
  JUDGE_CONTEST_FINDINGS_PAGE_SIZE,
} from '@/components/sections/judge/JudgeContestFindings'
import {prefetchGetContest} from '@/lib/queries/contest/getContest'

const JudgeContestFindingsPage = async ({
  params,
}: {
  params: {contestId: string}
}) => {
  await requireJudgeSession()

  await Promise.all([
    prefetchGetContest(params.contestId),
    prefetchGetContestFindings({
      contestId: params.contestId,
      pageParams: {
        limit: JUDGE_CONTEST_FINDINGS_PAGE_SIZE,
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
        <JudgeContestFindings contestId={params.contestId} />
      </HydrationBoundary>
    </main>
  )
}

export default JudgeContestFindingsPage
