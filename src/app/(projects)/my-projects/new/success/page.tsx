import Link from 'next/link'
import {ArrowLeft} from 'lucide-react'

import {Button} from '@/components/ui/Button'
import {requirePageSession} from '@/server/utils/auth'
import {PATHS} from '@/lib/utils/common/paths'

const NewContestSuccessPage = async () => {
  await requirePageSession()

  return (
    <main className="flex flex-grow flex-col items-center px-6 py-[134px]">
      <h1 className="text-center text-titleL uppercase">
        Thank you for submitting a new project!
      </h1>
      <p className="mb-12 mt-3 max-w-xl text-center">
        We will review its content and contact you by email to inform if the
        project submitted is valid. If yes, you will be asked to transfer the
        reward to our wallet address, so we can publish the project.
      </p>
      <Button asChild variant="outline">
        <Link href={PATHS.myProjects}>
          <ArrowLeft className="mr-2" /> Go to dashboard
        </Link>
      </Button>
    </main>
  )
}

export default NewContestSuccessPage
