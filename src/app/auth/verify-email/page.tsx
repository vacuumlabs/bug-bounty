'use client'

import {signIn} from 'next-auth/react'
import {useSearchParams} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

import {Button} from '@/components/ui/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {Input} from '@/components/ui/Input'

const formSchema = z.object({
  email: z.string().email(),
})

type FormValues = z.infer<typeof formSchema>

const VerifyEmailPage = () => {
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
    <main className="flex flex-col items-center gap-8 pt-[100px]">
      <h1 className="text-2xl">Verify your email</h1>
      <p>
        Sign in with your email address. We’ll send you a magic link to verify.
      </p>
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
    </main>
  )
}

export default VerifyEmailPage
