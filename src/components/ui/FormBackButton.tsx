'use client'

import {ArrowLeft} from 'lucide-react'

import {Button} from './Button'

import {useFormPageSearchParams} from '@/lib/hooks/useFormPageSearchParams'
import {cn} from '@/lib/utils/client/tailwind'

type FormBackButtonProps = {
  numberOfPages: number
  className?: string
}

const FormBackButton = ({className, numberOfPages}: FormBackButtonProps) => {
  const [page, setValue] = useFormPageSearchParams(numberOfPages)

  if (page === 1) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="small"
      onClick={() => setValue(page - 1)}
      className={cn('gap-3', className)}>
      <ArrowLeft />
      Go back
    </Button>
  )
}

export default FormBackButton
