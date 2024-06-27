'use client'

import {ArrowRight} from 'lucide-react'
import Link from 'next/link'

import FindingSeverityBadge from '../finding/FindingSeverityBadge'

import {Button} from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/Table'
import TableHeadWithSort from '@/components/ui/TableHeadWithSort'
import {useSearchParamsNumericState} from '@/lib/hooks/useSearchParamsState'
import {useSortingSearchParams} from '@/lib/hooks/useSortingSearchParams'
import {
  useGetDeduplicatedFindings,
  useGetDeduplicatedFindingsCount,
} from '@/lib/queries/deduplicatedFinding/getDeduplicatedFinding'
import {MyProjectVulnerabilitiesSorting} from '@/lib/types/enums'
import {PATHS} from '@/lib/utils/common/paths'
import TablePagination from '@/components/ui/TablePagination'

export const MY_PROJECT_VULNERABILITIES_PAGE_SIZE = 7

type MyProjectVulnerabilitiesProps = {
  contestId: string
}

const MyProjectVulnerabilitiesList = ({
  contestId,
}: MyProjectVulnerabilitiesProps) => {
  const [page, {getSearchParamsUpdater: updatePageSearchParams}] =
    useSearchParamsNumericState('page', 1)
  const [sortParams, {getSortParamsUpdaters: updateSortSearchParams}] =
    useSortingSearchParams(MyProjectVulnerabilitiesSorting)
  const {data: deduplicatedFindingsCount} =
    useGetDeduplicatedFindingsCount(contestId)
  const {data, isLoading} = useGetDeduplicatedFindings({
    contestId,
    limit: MY_PROJECT_VULNERABILITIES_PAGE_SIZE,
    offset: (page - 1) * MY_PROJECT_VULNERABILITIES_PAGE_SIZE,
    sort: sortParams,
  })

  if (isLoading) {
    return (
      <div className="mt-6 flex flex-col gap-6">
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center">
        <p className="mb-12 text-titleL uppercase">No vulnerabilities found</p>
        <Button asChild>
          <Link href={PATHS.newProject} className="gap-3">
            Create Audit
            <ArrowRight />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Table className="border-separate border-spacing-y-6 ">
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow>
            <TableHeadWithSort
              title="Vulnerability"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={MyProjectVulnerabilitiesSorting.VULNERABILITY}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
            <TableHeadWithSort
              title="Found by"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={MyProjectVulnerabilitiesSorting.FOUND_BY}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
            <TableHeadWithSort
              title="Severity"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={MyProjectVulnerabilitiesSorting.SEVERITY}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
            <TableHead className="text-bodyM text-grey-40" />
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr]:border-b-0">
          {data.map((data) => (
            <TableRow key={data.id} className="bg-grey-90">
              <TableCell className="text-bodyM">{data.title}</TableCell>
              <TableCell className="text-bodyM">{data.findingsCount}</TableCell>
              <TableCell className="text-bodyM">
                <FindingSeverityBadge severity={data.severity} />
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="small">
                  <Link href={PATHS.myProjectVulnerability(contestId, data.id)}>
                    see all reports
                  </Link>
                </Button>
                {data.bestFindingId && (
                  <Button asChild variant="default" size="small">
                    <Link
                      href={PATHS.myProjectVulnerabilityReport(
                        contestId,
                        data.id,
                        data.bestFindingId,
                      )}
                      className="ml-3 gap-2">
                      <span>go to best report</span>
                      <ArrowRight width={16} height={16} />
                    </Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!!deduplicatedFindingsCount?.count && (
        <TablePagination
          className="mt-12"
          pageSize={MY_PROJECT_VULNERABILITIES_PAGE_SIZE}
          totalCount={deduplicatedFindingsCount.count}
        />
      )}
    </>
  )
}

export default MyProjectVulnerabilitiesList
