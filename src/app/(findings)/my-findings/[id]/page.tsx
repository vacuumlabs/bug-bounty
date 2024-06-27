import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import MyFindingDetails from '@/components/sections/finding/MyFindingDetails'
import {prefetchGetMyFinding} from '@/lib/queries/finding/getMyFinding'
import {requirePageSession} from '@/server/utils/auth'

const MyFindingDetailPage = async ({params}: {params: {id: string}}) => {
  await requirePageSession()

  await prefetchGetMyFinding({findingId: params.id})

  return (
    <main className="mt-12 flex flex-grow flex-col">
      <HydrationBoundary>
        <MyFindingDetails findingId={params.id} />
      </HydrationBoundary>
    </main>
  )
}

export default MyFindingDetailPage
