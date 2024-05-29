import * as TabsPrimitive from '@radix-ui/react-tabs'
import {Fragment} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const Line = ({filled}: {filled: boolean}) => (
  <hr
    aria-orientation="horizontal"
    className={cn(
      'h-[1px] w-[120px] justify-center bg-white',
      filled && 'h-[2px]',
    )}
  />
)

const Dot = ({filled, color}: {filled: boolean; color: string}) => (
  <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white p-1.5">
    {filled && <div className={cn('h-full w-full rounded-full', color)} />}
  </div>
)

type FormPaginationProps = {
  pages: string[]
  currentIndex: number
  className?: string
}

const FormPagination = ({
  pages,
  currentIndex,
  className,
}: FormPaginationProps) => {
  return (
    <TabsPrimitive.List
      className={cn(
        'flex flex-grow flex-row items-center gap-6 self-center pb-9',
        className,
      )}>
      {pages.map((title, index) => (
        <Fragment key={index}>
          {!!index && <Line filled={index <= currentIndex} />}
          <TabsPrimitive.Trigger
            disabled
            value={(index + 1).toString()}
            className="relative">
            <Dot filled={index <= currentIndex} color={'bg-white'} />
            <span className="absolute -bottom-8 -translate-x-1/2 whitespace-nowrap">
              {title}
            </span>
          </TabsPrimitive.Trigger>
        </Fragment>
      ))}
    </TabsPrimitive.List>
  )
}

export default FormPagination
