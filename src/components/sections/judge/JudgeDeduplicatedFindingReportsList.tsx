import Link from 'next/link'
import {ArrowRight, Trash2, VerifiedIcon} from 'lucide-react'

import {Button} from '@/components/ui/Button'
import {PATHS} from '@/lib/utils/common/paths'
import {useRemoveDededuplicatedFinding} from '@/lib/queries/deduplicatedFinding/removeDeduplicatedFinding'
import {toast} from '@/components/ui/Toast'
import {GetFindingsReturn} from '@/server/actions/finding/getFinding'
import {GetDeduplicatedFindingReturn} from '@/server/actions/deduplicatedFinding/getDeduplicatedFinding'
import {useSetBestFinding} from '@/lib/queries/deduplicatedFinding/editDeduplicatedFinding'

type JudgeDeduplicatedFindingReportsListProps = {
  finding: GetFindingsReturn[number]
  deduplicatedFinding: GetDeduplicatedFindingReturn
}

const JudgeDeduplicatedFindingReportsList = ({
  finding,
  deduplicatedFinding,
}: JudgeDeduplicatedFindingReportsListProps) => {
  const {mutate: removeDeduplicatedFindingMutate} =
    useRemoveDededuplicatedFinding()
  const {mutate: setBestFindingMutate} = useSetBestFinding()

  const removeDeduplicatedFinding = () => {
    removeDeduplicatedFindingMutate(
      {findingId: finding.id},
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description:
              'Finding has been removed from this deduplicated finding.',
          })
        },
      },
    )
  }

  const setBestFinding = () => {
    setBestFindingMutate(
      {
        deduplicatedFindingId: deduplicatedFinding.id,
        bestFindingId: finding.id,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Best finding has been set.',
          })
        },
      },
    )
  }

  return (
    <div
      key={finding.id}
      className="flex h-[72px] w-full items-center justify-between bg-grey-90 p-4">
      <Button asChild variant="link">
        <Link href={PATHS.judgeFinding(finding.id)} className="flex gap-6">
          {deduplicatedFinding.bestFindingId === finding.id && (
            <div className="flex items-center gap-1">
              <VerifiedIcon width={24} height={24} />
              <span className="text-bodyS">Best</span>
            </div>
          )}
          <span className="text-titleS">{finding.title}</span>
        </Link>
      </Button>
      <div className="flex items-center gap-6">
        <div>
          <span className="text-bodyM opacity-70">Submited by: </span>
          <span className="text-bodyM">
            {finding.author.alias ?? finding.author.id}
          </span>
        </div>
        {deduplicatedFinding.bestFindingId !== finding.id && (
          <>
            <Button
              className="flex items-center gap-2"
              size="small"
              variant="outline"
              onClick={() => removeDeduplicatedFinding()}>
              <span>Remove</span>
              <Trash2 width={16} height={16} />
            </Button>
            <Button
              className="flex items-center gap-2"
              size="small"
              variant="purple"
              onClick={() => setBestFinding()}>
              <span>Set as best</span>
              <VerifiedIcon width={16} height={16} />
            </Button>
          </>
        )}
        <Button asChild size="small" variant="default">
          <Link href={PATHS.judgeFinding(finding.id)}>
            <span>Detail</span>
            <ArrowRight width={16} height={16} />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default JudgeDeduplicatedFindingReportsList
