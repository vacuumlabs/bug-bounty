import {type NewContestFormPageProps} from './NewContestForm'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {Input} from '@/components/ui/Input'

const NewContestFormPage1 = ({control}: NewContestFormPageProps) => {
  return (
    <FormField
      control={control}
      name="title"
      render={({field}) => (
        <FormItem>
          <FormLabel>What is the name of your project?</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default NewContestFormPage1
