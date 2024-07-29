'use client'

import {Button} from '@/components/ui/Button'
import {useGetRewards} from '@/lib/queries/reward/getRewards'
import {usePayReward} from '@/lib/queries/reward/payReward'
import {formatAda} from '@/lib/utils/common/format'
import type {RewardWithUser} from '@/server/actions/reward/getReward'

export const JUDGE_REWARDS_PAGE_SIZE = 20

type JudgeRewardsListRowProps = {
  reward: RewardWithUser
}

const JudgeRewardsListRow = ({reward}: JudgeRewardsListRowProps) => {
  const {mutate, isPending} = usePayReward()

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-col gap-1">
        <p>{reward.user.name}</p>
        <p className="text-xs text-slate-500">{reward.user.walletAddress}</p>
      </div>
      <div className="flex flex-row items-center gap-4">
        <p>{formatAda(reward.amount)}</p>
        {reward.transferTxHash ? (
          <p>Paid</p>
        ) : (
          <Button onClick={() => mutate(reward.id)} disabled={isPending}>
            Pay reward
          </Button>
        )}
      </div>
    </div>
  )
}

const JudgeRewardsList = () => {
  const {data: rewards} = useGetRewards({limit: JUDGE_REWARDS_PAGE_SIZE})

  return (
    <div className="flex flex-col gap-4 self-stretch">
      {rewards?.map((reward) => (
        <JudgeRewardsListRow reward={reward} key={reward.id} />
      ))}
    </div>
  )
}

export default JudgeRewardsList
