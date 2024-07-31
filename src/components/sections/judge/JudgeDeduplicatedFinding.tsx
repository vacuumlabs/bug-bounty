'use client'

import Link from 'next/link'
import {ArrowLeft, ArrowRight, Edit, Trash2, VerifiedIcon} from 'lucide-react'
import {notFound} from 'next/navigation'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import JudgeAddDeduplicatedFinding from './JudgeAddDeduplicatedFinding'
import FindingSeverityBadge from '../finding/FindingSeverityBadge'
import FindingSeverityButtonSelect from '../finding/NewFindingForm/FindingSeverityButtonSelect'

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
import {
  DialogRoot,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {Input} from '@/components/ui/Input'
import {editDeduplicatedFindingSchema} from '@/server/utils/validations/schemas'
import {useEditDeduplicatedFinding} from '@/lib/queries/deduplicatedFinding/editDeduplicatedFinding'
import Textarea from '@/components/ui/Textarea'

type JudgeDeduplicatedFindingProps = {
  deduplicatedFindingId: string
}

type FormValues = z.infer<typeof editDeduplicatedFindingSchema>

const JudgeDeduplicatedFinding = ({
  deduplicatedFindingId,
}: JudgeDeduplicatedFindingProps) => {
  const [isOpenEditDeduplicatedFinding, setIsOpenEditDeduplicatedFinding] =
    useState(false)

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

  const {mutate: removeDeduplicatedFindingMutate} =
    useRemoveDededuplicatedFinding()

  const removeDeduplicatedFinding = (findingId: string) => {
    removeDeduplicatedFindingMutate(
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

  const {mutate: editDeduplicatedFindingMutate} = useEditDeduplicatedFinding()

  const form = useForm<FormValues>({
    resolver: zodResolver(editDeduplicatedFindingSchema),
    defaultValues: {
      deduplicatedFindingId,
      description: deduplicatedFinding?.description,
      severity: deduplicatedFinding?.severity,
      title: deduplicatedFinding?.title,
    },
  })

  const editDeduplicatedFinding = ({
    description,
    severity,
    title,
  }: FormValues) => {
    editDeduplicatedFindingMutate(
      {
        deduplicatedFindingId,
        description,
        severity,
        title,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Deduplicated finding has been updated.',
          })
          setIsOpenEditDeduplicatedFinding(false)
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
              <DialogRoot
                open={isOpenEditDeduplicatedFinding}
                onOpenChange={setIsOpenEditDeduplicatedFinding}>
                <DialogTrigger>
                  <Button variant="ghost" className="flex gap-3">
                    <span className="uppercase">
                      <Edit />
                    </span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="border-0 bg-grey-90">
                  <Form {...form} onSubmit={editDeduplicatedFinding}>
                    <DialogHeader>
                      <DialogTitle className="text-titleM uppercase">
                        Edit Deduplicated Finding
                      </DialogTitle>
                      <DialogDescription className="text-bodyM text-white">
                        Edit the deduplicated finding details
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-8">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="severity"
                        render={({field: {ref, ...field}}) => (
                          <FormItem>
                            <FormLabel>Choose the severity level</FormLabel>
                            <FormControl>
                              <FindingSeverityButtonSelect {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({field: {ref, ...field}}) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex w-full justify-end">
                      <Button type="submit">Save</Button>
                    </div>
                  </Form>
                </DialogContent>
              </DialogRoot>
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
                <div
                  key={finding.id}
                  className="flex h-[72px] w-full items-center justify-between bg-grey-90 p-4">
                  <Button asChild variant="link">
                    <Link
                      href={PATHS.judgeFinding(finding.id)}
                      className="flex gap-6">
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
                      <span className="text-bodyM opacity-70">
                        Submited by:{' '}
                      </span>
                      <span className="text-bodyM">
                        {finding.author.alias ?? finding.author.id}
                      </span>
                    </div>
                    <Button
                      className="flex items-center gap-2"
                      size="small"
                      variant="outline"
                      onClick={() => removeDeduplicatedFinding(finding.id)}>
                      <span>Remove</span>
                      <Trash2 width={16} height={16} />
                    </Button>
                    <Button asChild size="small" variant="default">
                      <Link href={PATHS.judgeFinding(finding.id)}>
                        <span>Detail</span>
                        <ArrowRight width={16} height={16} />
                      </Link>
                    </Button>
                  </div>
                </div>
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
