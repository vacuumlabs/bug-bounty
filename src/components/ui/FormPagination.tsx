import * as TabsPrimitive from '@radix-ui/react-tabs'
import {Fragment} from 'react'

import {cn} from '@/lib/utils/client/tailwind'

const Line = ({filled}: {filled: boolean}) => (
  <hr
    aria-orientation="horizontal"
    className={cn(
      'h-1 w-[104px] justify-center rounded-full bg-slate-300',
      filled && 'bg-black',
    )}
  />
)

const Dot = ({filled, color}: {filled: boolean; color: string}) => (
  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white p-1">
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
        'flex flex-grow flex-row items-center gap-3 self-center pb-9',
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
            <span className="absolute -bottom-8 -translate-x-1/2 whitespace-nowrap text-sm">
              {title}
            </span>
          </TabsPrimitive.Trigger>
        </Fragment>
      ))}
    </TabsPrimitive.List>
  )
}

export default FormPagination
