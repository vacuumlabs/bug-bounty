'use client'

import {useSearchParams} from 'next/navigation'
import {signIn} from 'next-auth/react'
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

const formSchema = z.object({
  email: z.string().email(),
})

type FormValues = z.infer<typeof formSchema>

const VerifyEmailForm = () => {
  const searchParams = useSearchParams()

  const email = searchParams.get('email')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email ?? '',
    },
  })

  const {getValues, control} = form

  const onSubmit = () =>
    signIn('email', {
      email: email ?? getValues('email'),
      callbackUrl: '/profile/connect-wallet',
    })

  return (
    <Form
      {...form}
      onSubmit={onSubmit}
      className="flex w-[300px] flex-col items-center">
      {email ? (
        <p>{email}</p>
      ) : (
        <FormField
          control={control}
          name="email"
          render={({field}) => (
            <FormItem className="self-stretch">
              <FormLabel>Your email</FormLabel>
              <FormControl>
                <Input autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <Button disabled={!getValues('email')} type="submit">
        Send magic link
      </Button>
    </Form>
  )
}

export default VerifyEmailForm
