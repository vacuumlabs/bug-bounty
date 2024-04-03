'use client'

import {signOut} from 'next-auth/react'

import {Button, ButtonProps} from './Button'

type SignOutButtonProps = Omit<ButtonProps, 'onClick'> & {
  callbackUrl?: string
}

const SignOutButton = ({callbackUrl, ...props}: SignOutButtonProps) => (
  <Button {...props} onClick={() => signOut({callbackUrl})} />
)

export default SignOutButton
