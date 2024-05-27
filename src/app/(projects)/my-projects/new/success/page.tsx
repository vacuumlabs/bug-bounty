import Link from 'next/link'

import {Button} from '@/components/ui/Button'
import {requirePageSession} from '@/server/utils/auth'
import {PATHS} from '@/lib/utils/common/paths'

const NewContestSuccessPage = async () => {
  await requirePageSession()

  return (
    <main className="flex flex-grow flex-col items-center px-6 py-[134px]">
      <h1 className="text-lg font-bold">
        Thank you for submitting a new audit!
      </h1>
      <p className="mb-9 mt-4">
        Thank you for submitting your audit! Our team will begin reviewing it
        promptly.
      </p>
      <Button asChild variant="default">
        <Link href={PATHS.myProjects}>Go to dashboard</Link>
      </Button>
    </main>
  )
}

export default NewContestSuccessPage
