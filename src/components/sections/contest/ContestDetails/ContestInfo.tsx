'use client'

import Link from 'next/link'
import {LinkIcon} from 'lucide-react'

import {Contest} from '@/server/actions/contest/getContest'
import ContestSeverityWeightsDisplay from '@/components/ui/ContestSeverityWeightsDisplay'

type ContestInfoProps = {
  contest: Contest
}

const ContestInfo = ({contest}: ContestInfoProps) => {
  return (
    <div className="mt-12 xl:mx-[340px]">
      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">
          Links to the Github repository
        </h3>
        <Link href={contest.repoUrl} className="flex gap-3">
          <span>GitHub Repository</span>
          <LinkIcon width={24} height={24} />
        </Link>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Scope definition</h3>
        {contest.filesInScope.map((fileUrl) => (
          <Link href={contest.repoUrl} key={fileUrl} className="flex gap-3">
            <span>{fileUrl}</span>
            <LinkIcon width={24} height={24} />
          </Link>
        ))}
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Description</h3>
        <p className="text-bodyM">{contest.description}</p>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Severity Rewards</h3>
        <ContestSeverityWeightsDisplay
          info={contest.contestSeverityWeights?.info}
          low={contest.contestSeverityWeights?.low}
          medium={contest.contestSeverityWeights?.medium}
          high={contest.contestSeverityWeights?.high}
          critical={contest.contestSeverityWeights?.critical}
        />
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Custom conditions</h3>
        <p className="text-bodyM">{contest.customConditions}</p>
      </div>
    </div>
  )
}

export default ContestInfo
