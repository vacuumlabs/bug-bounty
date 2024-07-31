import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {Edit} from 'lucide-react'

import FindingSeverityButtonSelect from '../finding/NewFindingForm/FindingSeverityButtonSelect'

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
import Textarea from '@/components/ui/Textarea'
import {useEditDeduplicatedFinding} from '@/lib/queries/deduplicatedFinding/editDeduplicatedFinding'
import {editDeduplicatedFindingSchema} from '@/server/utils/validations/schemas'
import {FindingSeverity} from '@/server/db/models'
import {toast} from '@/components/ui/Toast'
import {Button} from '@/components/ui/Button'

type FormValues = z.infer<typeof editDeduplicatedFindingSchema>

type JudgeEditDeduplicatedFindingFormDialogProps = {
  deduplicatedFindingId: string
  defaultValues: {
    description: string
    severity: FindingSeverity
    title: string
  }
}

const JudgeEditDeduplicatedFindingFormDialog = ({
  deduplicatedFindingId,
  defaultValues,
}: JudgeEditDeduplicatedFindingFormDialogProps) => {
  const [isOpenEditDeduplicatedFinding, setIsOpenEditDeduplicatedFinding] =
    useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(editDeduplicatedFindingSchema),
    defaultValues: {
      deduplicatedFindingId,
      description: defaultValues.description,
      severity: defaultValues.severity,
      title: defaultValues.title,
    },
  })

  const {mutate: editDeduplicatedFindingMutate} = useEditDeduplicatedFinding()

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

  return (
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
  )
}

export default JudgeEditDeduplicatedFindingFormDialog
