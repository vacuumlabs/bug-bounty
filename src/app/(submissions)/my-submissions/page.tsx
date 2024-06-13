import Image from 'next/image'

import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import backgroundImage from '@public/images/thin-overlay.png'
import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetMyFindings} from '@/lib/queries/finding/getMyFinding'
import {prefetchGetMyFindingsCounts} from '@/lib/queries/finding/getMyFindingsCounts'
import SubmissionsDashboardOverview from '@/components/sections/submissions/SubmissionsDashboardOverview'
import MySubmissions from '@/components/sections/submissions/MySubmissions'

const MySubmissionsPage = async () => {
  await requirePageSession()

  await Promise.all([prefetchGetMyFindingsCounts(), prefetchGetMyFindings({})])

  return (
    <main className="mt-12 flex flex-grow flex-col">
      <Image
        src={backgroundImage}
        alt="Background image"
        width={514}
        style={{
          position: 'absolute',
          right: 0,
          top: -136,
          zIndex: -1,
        }}
      />
      <h1 className="mx-24 mb-6 text-headlineS uppercase">My Submissions</h1>
      <HydrationBoundary>
        <SubmissionsDashboardOverview className="mx-24 mb-12" />
        <MySubmissions />
      </HydrationBoundary>
    </main>
  )
}

export default MySubmissionsPage
