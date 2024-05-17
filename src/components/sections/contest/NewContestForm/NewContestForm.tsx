'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {UseFormReturn, useForm} from 'react-hook-form'
import {z} from 'zod'
import {useState} from 'react'
import {DateTime} from 'luxon'

import NewContestFormPage1, {page1fields} from './NewContestFormPage1'
import NewContestFormPage2, {page2fields} from './NewContestFormPage2'

import {Form} from '@/components/ui/Form'
import {useSearchParamsState} from '@/lib/hooks/useSearchParamsState'
import {useAddContest} from '@/lib/queries/contest/addContest'
import {
  addContestSchema,
  addContestSeverityWeightsSchema,
} from '@/server/utils/validations/schemas'
import {Tabs, TabsContent} from '@/components/ui/Tabs'
import {Button} from '@/components/ui/Button'
import {toast} from '@/components/ui/Toast'
import {ContestStatus} from '@/server/db/models'
import FormPagination from '@/components/ui/FormPagination'
import {ZodOutput} from '@/lib/types/zod'
import {GithubRepository} from '@/server/actions/github/getGithub'
import {Nullable, Override} from '@/lib/types/general'
import type {SeverityWeights} from '@/server/actions/reward/calculateRewards'

const formPages = ['Basic information', 'Parameter settings', 'Review']

const githubRepoSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  owner: z.string(),
  defaultBranch: z.string(),
  name: z.string(),
  fullName: z.string(),
}) satisfies ZodOutput<GithubRepository>

const formSchema = addContestSchema
  .omit({
    status: true,
    repoUrl: true,
  })
  .extend({
    rewardsAmount: z
      .string()
      .regex(/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/, 'Value is not a number'),
    severityWeights: addContestSeverityWeightsSchema
      .omit({id: true})
      .required()
      .refine(
        (data) =>
          data.info + data.low + data.medium + data.high + data.critical > 0,
        {message: 'At least one severity weight must be greater than 0'},
      ),
    repository: githubRepoSchema,
    timezone: z.string(),
    startDate: z
      .date()
      .min(new Date(), {message: 'Start date must be in the future'}),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after the start date',
    path: ['endDate'],
  })
  .transform(({rewardsAmount, ...data}) => ({
    ...data,
    rewardsAmount: Math.round(Number(rewardsAmount) * 10e6).toString(),
  }))

type FormValues = z.infer<typeof formSchema>
type InputFormValues = Override<
  Nullable<FormValues>,
  {
    severityWeights: Nullable<SeverityWeights>
  }
>
type AddContestStatus = z.infer<typeof addContestSchema>['status']

export type NewContestFormPageProps = {
  form: UseFormReturn<InputFormValues, unknown, FormValues>
}

const useNewContestFormSearchParamsPage = () => {
  const [page, setPage] = useSearchParamsState('page', '1')

  const parsedPage = Number.parseInt(page)
  const actualPage =
    Number.isNaN(parsedPage) || parsedPage < 1 || parsedPage > 3 ? '1' : page

  return [actualPage, setPage] as const
}

const NewContestForm = () => {
  const [page, setPage] = useNewContestFormSearchParamsPage()
  const [lastAllowedIndex, setLastAllowedIndex] = useState(0)

  const {mutate} = useAddContest()

  const form = useForm<InputFormValues, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      projectCategory: [],
      projectLanguage: [],
      rewardsAmount: null,
      customConditions: '',
      timezone: DateTime.local().zoneName,
      startDate: null,
      endDate: null,
      severityWeights: {
        info: 0,
        low: 1,
        medium: 3,
        high: 9,
        critical: 36,
      },
    },
  })

  const {handleSubmit, trigger} = form

  const getOnSubmit =
    (status: AddContestStatus) =>
    ({severityWeights, repository, ...values}: FormValues) => {
      mutate(
        {
          contest: {...values, repoUrl: repository.url, status},
          severityWeights,
        },
        {
          onSuccess: () =>
            toast({
              title:
                status === ContestStatus.DRAFT
                  ? 'Finding saved.'
                  : 'Finding added.',
            }),
        },
      )
    }

  const onContinue = async () => {
    const isValid = await trigger(page === '1' ? page1fields : page2fields)

    if (isValid) {
      setLastAllowedIndex((index) => Math.max(index, Number(page)))
      setPage((Number(page) + 1).toString())
    }
  }

  return (
    <Form {...form}>
      <Tabs value={page} onValueChange={setPage} className="flex flex-col">
        <FormPagination
          lastAllowedIndex={lastAllowedIndex}
          currentIndex={Number(page) - 1}
          pages={formPages}
          className="mb-11"
        />
        <TabsContent forceMount hidden={page !== '1'} value="1">
          <NewContestFormPage1 form={form} />
        </TabsContent>
        <TabsContent forceMount hidden={page !== '2'} value="2">
          <NewContestFormPage2 form={form} />
        </TabsContent>
        <TabsContent value="3">{/* TODO */}</TabsContent>
      </Tabs>
      <div className="flex justify-between">
        <Button
          variant="outline"
          type="submit"
          onClick={handleSubmit(getOnSubmit(ContestStatus.DRAFT))}>
          Save as draft
        </Button>
        {page === '3' ? (
          <Button
            type="submit"
            onClick={handleSubmit(getOnSubmit(ContestStatus.PENDING))}>
            Submit for review
          </Button>
        ) : (
          <Button onClick={onContinue}>Continue</Button>
        )}
      </div>
    </Form>
  )
}

export default NewContestForm
