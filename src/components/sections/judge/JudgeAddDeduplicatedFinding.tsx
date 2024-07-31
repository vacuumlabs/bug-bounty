'use client'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'

import JudgeAddDeduplicatedFindingTable from './JudgeAddDeduplicatedFindingTable'

import {useSearchParamsNumericState} from '@/lib/hooks/useSearchParamsState'
import {useGetFindingsToDeduplicate} from '@/lib/queries/finding/getFinding'
import {Form} from '@/components/ui/Form'
import {useSortingSearchParams} from '@/lib/hooks/useSortingSearchParams'
import {JudgeFindingToDeduplicateSorting} from '@/lib/types/enums'
import Skeleton from '@/components/ui/Skeleton'
import TablePagination from '@/components/ui/TablePagination'
import {Button} from '@/components/ui/Button'
import {useMergeDeduplicatedFindings} from '@/lib/queries/deduplicatedFinding/editDeduplicatedFinding'
import {addDeduplicatedFindingSchema} from '@/server/utils/validations/schemas'
import {toast} from '@/components/ui/Toast'

type JudgeAddDeduplicatedFindingProps = {
  deduplicatedFindingId: string
}

export const JUDGE_FINDINGS_TO_DEDUPLICATE_PAGE_SIZE = 10

export type AddDeduplicatedFindingForm = z.infer<
  typeof addDeduplicatedFindingSchema
>

const JudgeAddDeduplicatedFinding = ({
  deduplicatedFindingId,
}: JudgeAddDeduplicatedFindingProps) => {
  const [page, {getSearchParamsUpdater: updatePageSearchParams}] =
    useSearchParamsNumericState('page', 1)
  const [sortParams, {getSortParamsUpdaters: updateSortSearchParams}] =
    useSortingSearchParams(JudgeFindingToDeduplicateSorting)

  const {data: findings, isLoading} = useGetFindingsToDeduplicate({
    deduplicatedFindingId,
    pageParams: {
      limit: JUDGE_FINDINGS_TO_DEDUPLICATE_PAGE_SIZE,
      offset: (page - 1) * JUDGE_FINDINGS_TO_DEDUPLICATE_PAGE_SIZE,
    },
    sort: sortParams,
  })

  const {mutate} = useMergeDeduplicatedFindings()

  const form = useForm<AddDeduplicatedFindingForm>({
    resolver: zodResolver(addDeduplicatedFindingSchema),
    defaultValues: {
      deduplicatedFindingIds: [],
    },
  })

  const selectedCount = form.watch('deduplicatedFindingIds').length

  const mergeDeduplicatedFindings = ({
    deduplicatedFindingIds,
  }: AddDeduplicatedFindingForm) => {
    if (deduplicatedFindingIds.length === 0) return

    const ids = deduplicatedFindingIds.map(
      ({deduplicatedFindingId}) => deduplicatedFindingId,
    )

    mutate(
      {
        deduplicatedFindingIds: ids as [string, ...string[]],
        bestDeduplicatedFindingId: deduplicatedFindingId,
      },
      {
        onSuccess: () => {
          form.reset()
          toast({
            title: 'Success',
            description:
              'Findings have been added to this deduplicated finding.',
          })
        },
      },
    )
  }

  if (isLoading) {
    return <Skeleton className="h-[240px]" />
  }

  return (
    <div>
      <Form {...form} onSubmit={mergeDeduplicatedFindings}>
        <JudgeAddDeduplicatedFindingTable
          findings={findings?.data}
          sortParams={sortParams}
          updatePageSearchParams={updatePageSearchParams}
          updateSortSearchParams={updateSortSearchParams}
          form={form}
        />
        {!!findings?.pageParams.totalCount && (
          <TablePagination
            className="mt-12"
            pageSize={JUDGE_FINDINGS_TO_DEDUPLICATE_PAGE_SIZE}
            totalCount={findings.pageParams.totalCount}
          />
        )}
        <div className="mt-8 flex w-full justify-end">
          <div className="flex items-center gap-4">
            <span className="text-bodyM">{`${selectedCount} Selected`}</span>
            <Button type="submit" disabled={selectedCount === 0}>
              Add findings
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default JudgeAddDeduplicatedFinding
