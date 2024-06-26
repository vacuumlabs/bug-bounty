'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {UseFormReturn, useForm} from 'react-hook-form'
import {z} from 'zod'
import {DateTime} from 'luxon'
import {useRouter} from 'next/navigation'
import {ArrowRight} from 'lucide-react'

import NewContestFormPage1, {page1fields} from './NewContestFormPage1'
import NewContestFormPage2, {page2fields} from './NewContestFormPage2'
import NewContestFormReviewPage from './NewContestFormReviewPage'

import {useFormPageSearchParams} from '@/lib/hooks/useFormPageSearchParams'
import {Form} from '@/components/ui/Form'
import {useAddContest} from '@/lib/queries/contest/addContest'
import {
  addContestSchema,
  addContestSeverityWeightsSchema,
} from '@/server/utils/validations/schemas'
import {Tabs, TabsContent} from '@/components/ui/Tabs'
import {Button} from '@/components/ui/Button'
import {ContestStatus} from '@/server/db/models'
import FormPagination from '@/components/ui/FormPagination'
import {ZodOutput} from '@/lib/types/zod'
import {GithubRepository} from '@/server/actions/github/getGithub'
import {Nullable, Override} from '@/lib/types/general'
import type {SeverityWeights} from '@/server/actions/reward/calculateRewards'
import {PATHS} from '@/lib/utils/common/paths'
import {toast} from '@/components/ui/Toast'

const formPages = ['Basic information', 'Parameter settings', 'Review']

const githubRepoSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  owner: z.string(),
  defaultBranch: z.string(),
  name: z.string(),
  fullName: z.string(),
}) satisfies ZodOutput<GithubRepository>

const datesSchema = addContestSchema
  .pick({
    startDate: true,
    endDate: true,
  })
  .extend({
    timezone: z.string(),
    startDate: z
      .date()
      .min(new Date(), {message: 'Start date must be in the future'}),
  })
  .strip()
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after the start date',
    path: ['endDate'],
  })

const fieldsSchema = addContestSchema
  .omit({
    status: true,
    repoUrl: true,
    startDate: true,
    endDate: true,
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
  })
  .strip()

// A workaround otherwise Zod won't run refine validations until all the fields exist: https://github.com/colinhacks/zod/issues/479
const formSchema = z
  .intersection(fieldsSchema, datesSchema)
  .transform(({rewardsAmount, ...data}) => ({
    ...data,
    rewardsAmount: Math.round(Number(rewardsAmount) * 1e6).toString(),
  }))

type FormValues = z.infer<typeof formSchema>
type InputFormValues = Override<
  Nullable<FormValues>,
  {
    severityWeights: SeverityWeights
  }
>

export type NewContestFormPageProps = {
  form: UseFormReturn<InputFormValues, unknown, FormValues>
}

const NewContestForm = () => {
  const [page, setPage] = useFormPageSearchParams(3)
  const router = useRouter()

  const {mutate, isPending} = useAddContest()

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
      knownIssuesDescription: null,
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

  const addContest = ({
    severityWeights,
    repository,
    timezone,
    ...values
  }: FormValues) => {
    mutate(
      {
        contest: {
          ...values,
          repoUrl: repository.url,
          status: ContestStatus.IN_REVIEW,
        },
        severityWeights,
      },
      {
        onSuccess: () => {
          router.push(PATHS.newProjectSuccess)
        },
      },
    )
  }

  const onSubmit = handleSubmit(addContest, () =>
    toast({title: 'Submission failed.', description: 'Invalid input values.'}),
  )

  const onContinue = async () => {
    const isValid = await trigger(page === 1 ? page1fields : page2fields)

    if (isValid) {
      setPage(page + 1)
    }
  }

  return (
    <Form className="space-y-12" {...form}>
      <Tabs
        value={page.toString()}
        onValueChange={(value) => setPage(Number(value))}
        className="flex flex-col">
        <FormPagination
          currentIndex={page - 1}
          pages={formPages}
          className="mb-24"
        />
        <TabsContent forceMount hidden={page !== 1} value="1">
          <NewContestFormPage1 form={form} />
        </TabsContent>
        <TabsContent forceMount hidden={page !== 2} value="2">
          <NewContestFormPage2 form={form} />
        </TabsContent>
        <TabsContent value="3">
          <NewContestFormReviewPage form={form} />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end">
        {page === 3 ? (
          <Button type="submit" disabled={isPending} onClick={onSubmit}>
            {isPending ? 'Submitting...' : 'Submit for review'}
          </Button>
        ) : (
          <Button onClick={onContinue} className="gap-2">
            Continue
            <ArrowRight />
          </Button>
        )}
      </div>
    </Form>
  )
}

export default NewContestForm
