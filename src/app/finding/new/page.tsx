import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import NewFindingForm from '@/components/sections/finding/NewFindingForm'
import {prefetchGetPublicContests} from '@/lib/queries/contest/getContests'
import {requirePageSession} from '@/server/utils/auth'

const NewFindingPage = async () => {
  await requirePageSession()
  await prefetchGetPublicContests({type: 'current'})

  return (
    <main className="flex max-w-screen-lg flex-col gap-8 px-10 pb-20 pt-10">
      <h1 className="text-3xl font-semibold">New Finding</h1>
      <HydrationBoundary>
        <NewFindingForm />
      </HydrationBoundary>
    </main>
  )
}

export default NewFindingPage
