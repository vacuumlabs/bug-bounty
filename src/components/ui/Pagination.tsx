import {ArrowLeft, ArrowRight, MoreHorizontal} from 'lucide-react'
import {ComponentProps, forwardRef} from 'react'
import Link from 'next/link'

import {cn} from '@/lib/utils/client/tailwind'
import {Button, ButtonProps} from '@/components/ui/Button'

const Pagination = ({className, ...props}: ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = forwardRef<HTMLUListElement, ComponentProps<'ul'>>(
  ({className, ...props}, ref) => (
    <ul
      ref={ref}
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  ),
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = forwardRef<HTMLLIElement, ComponentProps<'li'>>(
  ({className, ...props}, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
  ),
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size' | 'disabled'> &
  ComponentProps<typeof Link>

const PaginationLink = ({
  className,
  children,
  isActive,
  disabled,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <Button
    asChild
    disabled={disabled}
    size={size}
    variant="link"
    className={cn(
      'h-[28px] w-[28px] rounded-full font-semibold normal-case',
      isActive && 'bg-white/10',
      className,
    )}>
    <Link
      aria-disabled={disabled}
      aria-current={isActive ? 'page' : undefined}
      {...props}>
      {children}
    </Link>
  </Button>
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn('w-fit gap-1 pl-2.5', className)}
    size="medium"
    {...props}>
    <ArrowLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn('w-fit gap-1 pr-2.5', className)}
    size="medium"
    {...props}>
    <span>Next</span>
    <ArrowRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({className, ...props}: ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
