import {useMemo} from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination'

import {useSearchParamsNumericState} from '@/lib/hooks/useSearchParamsState'

const ELLIPSIS = 'ELLIPSIS'

type TablePaginationProps = {
  className?: string
  pageSize: number
  totalCount: number
}

const TablePagination = ({
  className,
  pageSize,
  totalCount,
}: TablePaginationProps) => {
  const numberOfPages = Math.ceil(totalCount / pageSize)
  const [currentPage, _, getNewUrl] = useSearchParamsNumericState('page', 1)

  const pages: (typeof ELLIPSIS | number)[] = useMemo(() => {
    if (numberOfPages <= 6) {
      return Array.from({length: numberOfPages}, (_, index) => index + 1)
    }
    if (currentPage < 3) {
      return [1, 2, 3, ELLIPSIS, numberOfPages]
    }
    if (currentPage === 3) {
      return [1, 2, 3, 4, ELLIPSIS, numberOfPages]
    }
    if (currentPage > numberOfPages - 2) {
      return [1, ELLIPSIS, numberOfPages - 2, numberOfPages - 1, numberOfPages]
    }
    if (currentPage === numberOfPages - 2) {
      return [
        1,
        ELLIPSIS,
        numberOfPages - 3,
        numberOfPages - 2,
        numberOfPages - 1,
        numberOfPages,
      ]
    }
    return [
      1,
      ELLIPSIS,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      ELLIPSIS,
      numberOfPages,
    ]
  }, [currentPage, numberOfPages])

  return (
    <Pagination className={className}>
      <PaginationContent className="gap-4">
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 1}
            href={getNewUrl(currentPage - 1)}
            scroll={false}
          />
        </PaginationItem>
        {pages.map((page, index) =>
          page === ELLIPSIS ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                isActive={page === currentPage}
                href={getNewUrl(page)}
                scroll={false}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            disabled={currentPage === numberOfPages}
            href={getNewUrl(currentPage + 1)}
            scroll={false}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default TablePagination
