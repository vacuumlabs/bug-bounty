import {type NewFindingFormPageProps} from './NewFindingForm'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {Input} from '@/components/ui/Input'
import Separator from '@/components/ui/Separator'
import MarkdownEditor from '@/components/markdown/MarkdownEditor'
import Dropzone from '@/components/ui/Dropzone'

export const page2fields = [
  'title',
  'description',
  'proofOfConcept',
  'attachments',
] as const

const NewFindingFormPage2 = ({form}: NewFindingFormPageProps) => {
  const {control} = form

  return (
    <div className="flex flex-col gap-12">
      <FormField
        control={control}
        name="title"
        render={({field}) => (
          <FormItem>
            <FormLabel>Report title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              The title should give enough information to understand what the
              bug report is about.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({field}) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <MarkdownEditor {...field} />
            </FormControl>
            <FormDescription>
              The better your description, the quicker and more precise we can
              understand your bug report.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="proofOfConcept"
        render={({field}) => (
          <FormItem>
            <FormLabel>Proof of concept</FormLabel>
            <FormControl>
              <MarkdownEditor {...field} />
            </FormControl>
            <FormDescription>
              A practical demonstration, example, or experiment that proves the
              bug exists and can be exploited under certain conditions.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="attachments"
        render={({field}) => (
          <FormItem>
            <FormLabel>{'Upload file (optional)'}</FormLabel>
            <p className="mt-1 text-bodyS text-grey-20">
              You can attach multiple files up to 3 MB per file.
            </p>
            <Separator className="my-4" />
            <FormControl>
              <Dropzone
                {...field}
                message="You can attach multiple files up to 3 MB per file."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default NewFindingFormPage2
