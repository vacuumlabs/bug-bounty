'use client'

import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

import {Input} from '@/components/ui/Input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {Button} from '@/components/ui/Button'
import {useSetUserAlias} from '@/lib/queries/user/setUserAlias'
import {FormError} from '@/lib/types/error'
import {toast} from '@/components/ui/Toast'

const formSchema = z.object({
  alias: z.string().min(3),
})

type FormValues = z.infer<typeof formSchema>

type SetUserAliasFormProps = {
  initialAlias: string | null | undefined
}

const SetUserAliasForm = ({initialAlias}: SetUserAliasFormProps) => {
  const {mutate, isPending} = useSetUserAlias()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alias: initialAlias ?? '',
    },
  })

  const {
    getValues,
    control,
    formState: {isDirty},
    reset,
  } = form

  const onSubmit = () => {
    const alias = getValues('alias') || null
    mutate(alias, {
      onError: (error) => {
        if (error instanceof FormError) {
          form.setError('alias', {type: 'custom', message: error.message})
        }
      },
      onSuccess: () => {
        reset(getValues(), {keepValues: true})
        toast({title: 'Alias set.'})
      },
    })
  }

  return (
    <Form {...form} onSubmit={onSubmit}>
      <FormField
        control={control}
        name="alias"
        render={({field}) => (
          <FormItem className="self-stretch">
            <FormLabel>Your alias</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input {...field} />
              </FormControl>
              <Button
                size="large"
                disabled={isPending || !isDirty}
                type="submit">
                Set alias
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}

export default SetUserAliasForm
