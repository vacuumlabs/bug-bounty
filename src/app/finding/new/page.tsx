import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import NewFindingForm from '@/components/sections/finding/NewFindingForm'
import {prefetchGetPublicContests} from '@/lib/queries/contest/getContests'
import {requirePageSession} from '@/server/utils/auth'

const NewFindingPage = async () => {
  await requirePageSession()
  await prefetchGetPublicContests({type: 'current'})

  return (
    <main className="flex max-w-screen-lg flex-col gap-8 px-10 py-[30px]">
      <h1 className="text-3xl ">New Finding</h1>
      <HydrationBoundary>
        <NewFindingForm />
      </HydrationBoundary>
    </main>
  )
}

export default NewFindingPage
