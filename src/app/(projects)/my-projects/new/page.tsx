import {NewContestForm} from '@/components/sections/contest/NewContestForm'
import GithubSignInButton from '@/components/sections/contest/NewContestForm/GithubSignInButton'
import FormBackButton from '@/components/ui/FormBackButton'
import {requirePageSession} from '@/server/utils/auth'

const NewContestPage = async () => {
  const session = await requirePageSession()

  return (
    <main className="flex flex-grow flex-col items-center px-24 pb-20 pt-6">
      <FormBackButton numberOfPages={3} className="self-start" />
      <div className="flex w-full max-w-3xl flex-col">
        <h1 className="mb-12 self-center text-headlineS uppercase">
          Set up a new audit
        </h1>
        {session.user.provider === 'github' ? (
          <NewContestForm />
        ) : (
          <GithubSignInButton className="mt-10 self-center" />
        )}
      </div>
    </main>
  )
}

export default NewContestPage
