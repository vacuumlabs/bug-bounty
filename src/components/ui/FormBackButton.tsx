'use client'

import {useRouter} from 'next/navigation'
import {ArrowLeft} from 'lucide-react'

import {Button} from './Button'

import {cn} from '@/lib/utils/client/tailwind'

type FormBackButtonProps = {
  className?: string
}

const FormBackButton = ({className}: FormBackButtonProps) => {
  const router = useRouter()

  return (
    <Button
      variant="link"
      onClick={() => router.back()}
      className={cn('gap-3', className)}>
      <ArrowLeft />
      Go back
    </Button>
  )
}

export default FormBackButton
