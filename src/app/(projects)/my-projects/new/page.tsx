import {NewContestForm} from '@/components/sections/contest/NewContestForm'
import FormBackButton from '@/components/ui/FormBackButton'
import {requirePageSession} from '@/server/utils/auth'

const NewContestPage = async () => {
  await requirePageSession()

  return (
    <main className="flex flex-grow flex-col items-center px-24 pb-20 pt-6">
      <FormBackButton className="self-start" />
      <div className="flex w-full max-w-2xl flex-col">
        <h1 className="mb-12 self-center text-headlineS uppercase">
          Set up a new audit
        </h1>
        <NewContestForm />
      </div>
    </main>
  )
}

export default NewContestPage
