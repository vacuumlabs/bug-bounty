'use client'

import {LinkIcon} from 'lucide-react'

import {Contest} from '@/server/actions/contest/getContest'

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
        <div className="flex gap-3">
          <a href={contest.repoUrl}>GitHub Repository</a>
          <LinkIcon width={24} height={24} />
        </div>
        <div className="flex gap-3">
          <a href="https://github.com/input-output-hk/marlowe">
            Marlowe GitHub repository
          </a>
          <LinkIcon width={24} height={24} />
        </div>
        <div className="flex gap-3 capitalize">
          <a href="https://developers.cardano.org/docs/smart-contracts/">
            Cardano smart contracts documentation
          </a>
          <LinkIcon width={24} height={24} />
        </div>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Scope definition</h3>
        {contest.filesInScope.map((fileUrl) => (
          <div key={fileUrl} className="flex gap-3">
            <a href={contest.repoUrl}>{fileUrl}</a>
            <LinkIcon width={24} height={24} />
          </div>
        ))}
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Description</h3>
        <p className="text-bodyM">{contest.description}</p>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Severity Rewards</h3>
        <div className="flex gap-6">
          <div className="inline-block">
            <span className="text-bodyM text-grey-30">info: </span>
            <span className="text-bodyM text-white">
              {contest.contestSeverityWeights?.info ?? '-'}
            </span>
          </div>
          <div className="h-6 w-[1px] bg-white" />
          <div className="inline-block">
            <span className="text-bodyM capitalize text-grey-30">low: </span>
            <span className="text-bodyM text-white">
              {contest.contestSeverityWeights?.low ?? '-'}
            </span>
          </div>
          <div className="h-6 w-[1px] bg-white" />
          <div className="inline-block">
            <span className="text-bodyM capitalize text-grey-30">medium: </span>
            <span className="text-bodyM text-white">
              {contest.contestSeverityWeights?.medium ?? '-'}
            </span>
          </div>
          <div className="h-6 w-[1px] bg-white" />
          <div className="inline-block">
            <span className="text-bodyM capitalize text-grey-30">high: </span>
            <span className="text-bodyM text-white">
              {contest.contestSeverityWeights?.high ?? '-'}
            </span>
          </div>
          <div className="h-6 w-[1px] bg-white" />
          <div className="inline-block">
            <span className="text-bodyM capitalize text-grey-30">
              critical:{' '}
            </span>
            <span className="text-bodyM text-white">
              {contest.contestSeverityWeights?.critical ?? '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Custom conditions</h3>
        <p className="text-bodyM">{contest.customConditions}</p>
      </div>
    </div>
  )
}

export default ContestInfo
