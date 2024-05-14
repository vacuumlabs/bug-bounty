'use client'

import {useSearchParams} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {Input} from '@/components/ui/Input'
import {addFindingSchema} from '@/server/utils/validations/schemas'
import {useAddFinding} from '@/lib/queries/finding/addFinding'
import {Textarea} from '@/components/ui/Textarea'
import {Select} from '@/components/ui/Select'
import {selectOptions} from '@/lib/utils/common/enums'
import {Button} from '@/components/ui/Button'
import {ContestOccurence, FindingStatus} from '@/server/db/models'
import {useGetPublicContests} from '@/lib/queries/contest/getContests'
import {AsyncCombobox} from '@/components/ui/Combobox'
import {toast} from '@/components/ui/Toast'
import Dropzone from '@/components/ui/Dropzone'

const formSchema = addFindingSchema
  .omit({
    status: true,
  })
  .extend({
    attachments: z.instanceof(File).array().optional(),
  })

type FormValues = z.infer<typeof formSchema>

type AddFindingStatus = z.infer<typeof addFindingSchema>['status']

const useGetFilteredContests = (searchQuery: string) =>
  useGetPublicContests({
    type: ContestOccurence.PRESENT,
    searchQuery: searchQuery || undefined,
  })

const NewFindingForm = () => {
  const searchParams = useSearchParams()
  const contestId = searchParams.get('contestId') ?? undefined

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contestId,
      title: '',
      description: '',
      targetFileUrl: '',
    },
  })

  const {mutate} = useAddFinding()

  const {handleSubmit} = form

  const getOnSubmit =
    (status: AddFindingStatus) =>
    ({attachments, ...values}: FormValues) => {
      mutate(
        {finding: {...values, status}, attachments},
        {
          onSuccess: () => toast({title: 'Finding added.'}),
        },
      )
    }

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="contestId"
        render={({field}) => (
          <FormItem>
            <FormLabel>Contest</FormLabel>
            <FormControl>
              <AsyncCombobox
                value={field.value}
                onChange={field.onChange}
                useGetData={useGetFilteredContests}
                formatOption={(contest) => ({
                  value: contest.id,
                  label: contest.title,
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
        name="description"
        render={({field}) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="targetFileUrl"
        render={({field}) => (
          <FormItem>
            <FormLabel>Affected file URL</FormLabel>
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
        render={({field}) => (
          <FormItem>
            <FormLabel>Severity</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                options={selectOptions.findingSeverity}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="attachments"
        render={({field}) => (
          <FormItem>
            <FormLabel>Attachments</FormLabel>
            <FormControl>
              <Dropzone
                {...field}
                message="Drag and drop or select multiple files"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-2">
        <Button
          variant="outline"
          type="submit"
          onClick={handleSubmit(getOnSubmit(FindingStatus.DRAFT))}>
          Save as draft
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(getOnSubmit(FindingStatus.PENDING))}>
          Submit
        </Button>
      </div>
    </Form>
  )
}

export default NewFindingForm
