'use client'

import {useRouter} from 'next/navigation'
import {UseFormReturn, useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {ArrowRight} from 'lucide-react'

import NewFindingFormPage1, {page1fields} from './NewFindingFormPage1'
import NewFindingFormPage2, {page2fields} from './NewFindingFormPage2'
import NewFindingFormReviewPage from './NewFindingFormReviewPage'

import {Form} from '@/components/ui/Form'
import {addFindingSchema} from '@/server/utils/validations/schemas'
import {useAddFinding} from '@/lib/queries/finding/addFinding'
import {Button} from '@/components/ui/Button'
import {FindingStatus} from '@/server/db/models'
import {toast} from '@/components/ui/Toast'
import {Tabs, TabsContent} from '@/components/ui/Tabs'
import FormPagination from '@/components/ui/FormPagination'
import {useSearchParamsState} from '@/lib/hooks/useSearchParamsState'
import {useFormPageSearchParams} from '@/lib/hooks/useFormPageSearchParams'
import {Nullable} from '@/lib/types/general'
import {PATHS} from '@/lib/utils/common/paths'
import {useGetUser} from '@/lib/queries/user/getUser'

const MAX_FILE_SIZE = 1024 * 1024 * 3 // 3MB
const formPageTitles = ['Basic information', 'Report description', 'Review']

const fileSchema = z
  .instanceof(File)
  .array()
  .refine(
    (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
    'Max file size is 3MB',
  )

const formSchema = addFindingSchema
  .omit({
    status: true,
  })
  .extend({
    attachments: fileSchema,
  })

type FormValues = z.infer<typeof formSchema>
type InputFormValues = Nullable<FormValues>

export type NewFindingFormPageProps = {
  form: UseFormReturn<InputFormValues, unknown, FormValues>
}

const NewFindingForm = () => {
  const router = useRouter()
  const [page, setPage] = useFormPageSearchParams(3)
  const [contestId] = useSearchParamsState('contestId')

  const {data: user} = useGetUser()

  const form = useForm<InputFormValues, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contestId,
      rewardWalletAddress: user?.walletAddress ?? null,
      title: '',
      description: '',
      proofOfConcept: '',
      affectedFiles: [],
      attachments: [],
    },
  })

  const {mutate, isPending} = useAddFinding()

  const {handleSubmit, trigger} = form

  const addFinding = ({attachments, ...values}: FormValues) => {
    mutate(
      {finding: {...values, status: FindingStatus.PENDING}, attachments},
      {
        onSuccess: () => router.push(PATHS.newFindingSuccess),
      },
    )
  }

  const onSubmit = handleSubmit(addFinding, () =>
    toast({title: 'Submission failed.', description: 'Invalid input values.'}),
  )

  const onContinue = async () => {
    const isValid = await trigger(page === 1 ? page1fields : page2fields)

    if (isValid) {
      setPage(page + 1)
    }
  }

  return (
    <Form {...form}>
      <Tabs
        value={page.toString()}
        onValueChange={(value) => setPage(Number(value))}
        className="flex flex-col">
        <FormPagination
          currentIndex={page - 1}
          pages={formPageTitles}
          className="mb-24"
        />
        <TabsContent forceMount hidden={page !== 1} value="1">
          <NewFindingFormPage1 form={form} />
        </TabsContent>
        <TabsContent forceMount hidden={page !== 2} value="2">
          <NewFindingFormPage2 form={form} />
        </TabsContent>
        <TabsContent value="3">
          <NewFindingFormReviewPage form={form} />
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

export default NewFindingForm
