'use client'

import {ArrowRight} from 'lucide-react'
import Link from 'next/link'

import {Button} from '@/components/ui/Button'
import {useSearchParamsState} from '@/lib/hooks/useSearchParamsState'
import {HomePageTab} from '@/lib/types/enums'
import {PATHS} from '@/lib/utils/common/paths'

const HomePageCtaButton = () => {
  const [currentTab] = useSearchParamsState('tab')
  const isProjectsTabActive = currentTab === HomePageTab.PROJECTS

  return (
    <Button asChild>
      {isProjectsTabActive ? (
        <Link href={PATHS.newProject}>
          {'Get protected'}
          <ArrowRight className="ml-2" />
        </Link>
      ) : (
        <Link href={PATHS.newFinding}>
          {'Submit a report'}
          <ArrowRight className="ml-2" />
        </Link>
      )}
    </Button>
  )
}

export default HomePageCtaButton
