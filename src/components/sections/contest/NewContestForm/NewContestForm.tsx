'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {Control, useForm} from 'react-hook-form'
import {z} from 'zod'
import {useState} from 'react'

import NewContestFormPage1 from './NewContestFormPage1'

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

const formPages = ['Basic information', 'Parameter settings', 'Review']

const formSchema = addContestSchema
  .omit({
    status: true,
  })
  .extend({
    customWeights: addContestSeverityWeightsSchema,
  })

type FormValues = z.infer<typeof formSchema>
type AddContestStatus = z.infer<typeof addContestSchema>['status']

export type NewContestFormPageProps = {
  control: Control<FormValues>
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const {control, handleSubmit, trigger} = form

  const getOnSubmit =
    (status: AddContestStatus) =>
    ({customWeights, ...values}: FormValues) => {
      mutate(
        {contest: {...values, status}, customWeights},
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
        />
        <TabsContent className="mt-11" value="1">
          <NewContestFormPage1 control={control} />
        </TabsContent>
        <TabsContent value="2">{/* TODO */}</TabsContent>
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
