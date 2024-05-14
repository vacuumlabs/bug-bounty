import {NewContestForm} from '@/components/sections/contest/NewContestForm'
import {requirePageSession} from '@/server/utils/auth'

const NewContestPage = async () => {
  await requirePageSession()

  return (
    <main className="flex flex-grow flex-col items-center px-6 pb-20 pt-6">
      <div className="flex w-full max-w-2xl flex-col">
        <h1 className="mb-5 text-lg font-semibold">Set up a new audit</h1>
        <NewContestForm />
      </div>
    </main>
  )
}

export default NewContestPage
