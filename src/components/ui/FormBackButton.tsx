'use client'

import {ArrowLeft} from 'lucide-react'

import {Button} from './Button'
import {useNewContestFormPageSearchParams} from '../sections/contest/NewContestForm/hooks'

import {cn} from '@/lib/utils/client/tailwind'

type FormBackButtonProps = {
  className?: string
}

const FormBackButton = ({className}: FormBackButtonProps) => {
  const [page, setValue] = useNewContestFormPageSearchParams()

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
