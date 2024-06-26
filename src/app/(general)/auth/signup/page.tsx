'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {Input} from '@/components/ui/Input'
import {Button} from '@/components/ui/Button'
import {useSignUp} from '@/lib/queries/auth/signUp'
import {FormError} from '@/lib/types/error'
import {signUpSchema} from '@/server/utils/validations/schemas'

const formSchema = signUpSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof formSchema>

const SignUpPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const {mutate: signUp} = useSignUp()

  const onSubmit = ({confirmPassword, ...values}: FormValues) => {
    signUp(values, {
      onError: (error) => {
        if (error instanceof FormError) {
          form.setError('email', {type: 'custom', message: error.message})
        }
      },
    })
  }

  return (
    <main className="flex flex-col items-center justify-center gap-10 py-[100px]">
      <h1 className="text-3xl font-semibold">Sign Up</h1>
      <Form {...form} onSubmit={onSubmit} className="w-[300px]">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Your name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({field}) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </Form>
    </main>
  )
}

export default SignUpPage
