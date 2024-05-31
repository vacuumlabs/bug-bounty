'use client'

import {signOut} from 'next-auth/react'

import {Button, ButtonProps} from './Button'

import {PATHS} from '@/lib/utils/common/paths'

type SignOutButtonProps = Omit<ButtonProps, 'onClick'> & {
  callbackUrl?: string
}

const SignOutButton = ({
  callbackUrl = PATHS.home,
  ...props
}: SignOutButtonProps) => (
  <Button {...props} onClick={() => signOut({callbackUrl})} />
)

export default SignOutButton
