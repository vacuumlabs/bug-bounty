'use client'

import {signOut} from 'next-auth/react'
import {useEffect, useState} from 'react'

import {Button, ButtonProps} from './Button'
import {DialogContent, DialogPortal, DialogRoot, DialogTrigger} from './Dialog'

import {PATHS} from '@/lib/utils/common/paths'

const POPUP_CLOSE_DELAY = 3000

type SignOutButtonProps = Omit<ButtonProps, 'onClick'> & {
  callbackUrl?: string
}

const SignOutButton = ({
  callbackUrl = PATHS.home,
  ...props
}: SignOutButtonProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useEffect(() => {
    if (isPopupOpen) {
      setTimeout(() => setIsPopupOpen(false), POPUP_CLOSE_DELAY)
    }
  }, [isPopupOpen])

  return (
    <DialogRoot open={isPopupOpen} onOpenChange={setIsPopupOpen}>
      <DialogTrigger asChild>
        <Button {...props} onClick={() => signOut({callbackUrl})} />
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="w-[500px] border-0 bg-grey-90 p-12 text-center text-titleL uppercase">
          You have successfully logged out
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}

export default SignOutButton
