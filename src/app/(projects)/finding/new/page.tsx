import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import NewFindingForm from '@/components/sections/finding/NewFindingForm/NewFindingForm'
import FormBackButton from '@/components/ui/FormBackButton'
import {prefetchGetPublicContests} from '@/lib/queries/contest/getPublicContests'
import {prefetchGetUser} from '@/lib/queries/user/getUser'
import {ContestOccurence} from '@/server/db/models'
import {requirePageSession} from '@/server/utils/auth'

const NewFindingPage = async () => {
  const session = await requirePageSession()

  await Promise.all([
    prefetchGetUser(session.user.id),
    prefetchGetPublicContests({type: ContestOccurence.PRESENT}),
  ])

  return (
    <main className="flex flex-grow flex-col items-center px-24 pb-20 pt-6">
      <FormBackButton numberOfPages={3} className="self-start" />
      <div className="flex w-full max-w-3xl flex-col">
        <h1 className="mb-12 self-center text-headlineS uppercase">
          New report submission
        </h1>
        <HydrationBoundary>
          <NewFindingForm />
        </HydrationBoundary>
      </div>
    </main>
  )
}

export default NewFindingPage
