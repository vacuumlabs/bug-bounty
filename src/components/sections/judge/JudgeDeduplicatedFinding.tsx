'use client'

import Link from 'next/link'
import {ArrowLeft} from 'lucide-react'
import {notFound} from 'next/navigation'

import JudgeAddDeduplicatedFinding from './JudgeAddDeduplicatedFinding'
import FindingSeverityBadge from '../finding/FindingSeverityBadge'
import JudgeEditDeduplicatedFindingFormDialog from './JudgeEditDeduplicatedFindingFormDialog'
import JudgeDeduplicatedFindingReportsList from './JudgeDeduplicatedFindingReportsList'

import {Button} from '@/components/ui/Button'
import {PATHS} from '@/lib/utils/common/paths'
import Separator from '@/components/ui/Separator'
import {useGetDeduplicatedFinding} from '@/lib/queries/deduplicatedFinding/getDeduplicatedFinding'
import Skeleton from '@/components/ui/Skeleton'
import {useGetFindings} from '@/lib/queries/finding/getFinding'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {useSearchParamsEnumState} from '@/lib/hooks/useSearchParamsState'
import {JudgeDeduplicatedFindingTab} from '@/server/db/models'
import {useRemoveDededuplicatedFinding} from '@/lib/queries/deduplicatedFinding/removeDeduplicatedFinding'
import {toast} from '@/components/ui/Toast'

type JudgeDeduplicatedFindingProps = {
  deduplicatedFindingId: string
}

const JudgeDeduplicatedFinding = ({
  deduplicatedFindingId,
}: JudgeDeduplicatedFindingProps) => {
  const [tab, {setValue: setTabValue}] = useSearchParamsEnumState(
    'tab',
    JudgeDeduplicatedFindingTab,
    JudgeDeduplicatedFindingTab.REPORTS,
  )
  const {data: deduplicatedFinding, isLoading: deduplicatedFindingLoading} =
    useGetDeduplicatedFinding(deduplicatedFindingId)
  const {data: findings, isLoading: findingsLoading} = useGetFindings({
    deduplicatedFindingId,
  })

  const {mutate} = useRemoveDededuplicatedFinding()

  const removeDeduplicatedFinding = (findingId: string) => {
    mutate(
      {findingId},
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

  if (deduplicatedFindingLoading || findingsLoading) {
    return (
      <div className="px-24">
        <div className="mb-12">
          <Skeleton className="h-[72px]" />
        </div>
        <Separator />
        <div className="mt-12 flex flex-col gap-3">
          <Skeleton className="h-[72px]" />
          <Skeleton className="h-[72px]" />
          <Skeleton className="h-[72px]" />
        </div>
      </div>
    )
  }

  if (!deduplicatedFinding || !findings) {
    return notFound()
  }

  return (
    <>
      <div className="px-24">
        <div className="flex items-center gap-12">
          <Button variant="outline" size="small" asChild>
            <Link
              href={`${PATHS.judgeContestFindings(deduplicatedFinding.contestId)}?type=APPROVED`}
              className="flex gap-2">
              <ArrowLeft width={16} height={16} />
              Go Back
            </Link>
          </Button>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <h1 className="text-headlineS">{deduplicatedFinding.title}</h1>
              <JudgeEditDeduplicatedFindingFormDialog
                deduplicatedFindingId={deduplicatedFindingId}
                defaultValues={{
                  title: deduplicatedFinding.title,
                  description: deduplicatedFinding.description,
                  severity: deduplicatedFinding.severity,
                }}
              />
            </div>
            <div>
              <FindingSeverityBadge severity={deduplicatedFinding.severity} />
            </div>
            <span className="text-titleS">
              {deduplicatedFinding.contest.title}
            </span>
            <p>{deduplicatedFinding.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <Tabs
          value={tab}
          onValueChange={setTabValue}
          className="flex flex-grow flex-col">
          <TabsList className="self-start px-24">
            <TabsTrigger value={JudgeDeduplicatedFindingTab.REPORTS}>
              reports
            </TabsTrigger>
            <TabsTrigger value={JudgeDeduplicatedFindingTab.ADD_FINDINGS}>
              Add findings
            </TabsTrigger>
          </TabsList>

          <Separator />
          <div className="flex flex-grow flex-col bg-black px-24 pb-24 pt-12">
            <TabsContent
              value={JudgeDeduplicatedFindingTab.REPORTS}
              className="flex flex-col gap-4">
              {findings.map((finding) => (
                <JudgeDeduplicatedFindingReportsList
                  key={finding.id}
                  finding={finding}
                  deduplicatedFinding={deduplicatedFinding}
                />
              ))}
            </TabsContent>
            <TabsContent value={JudgeDeduplicatedFindingTab.ADD_FINDINGS}>
              <JudgeAddDeduplicatedFinding
                deduplicatedFindingId={deduplicatedFindingId}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  )
}

export default JudgeDeduplicatedFinding
