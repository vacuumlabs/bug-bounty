import Link from 'next/link'

import {Button} from '@/components/ui/Button'
import {requirePageSession} from '@/server/utils/auth'
import {PATHS} from '@/lib/utils/common/paths'

const NewFindingSuccessPage = async () => {
  await requirePageSession()

  return (
    <main className="flex flex-grow flex-col items-center px-6 py-[134px]">
      <h1 className="text-center text-titleL uppercase">
        Thank you for submitting the report!
      </h1>
      <p className="mt-3 max-w-xl text-center">
        Thanks for submitting your report!
      </p>
      <p className="mb-12 mt-3 max-w-xl text-center">
        Our auditors will begin reviewing it once the contest has ended and
        contact you by email if your submission is eligible to be rewarded.
      </p>
      <Button asChild variant="outline">
        <Link href={PATHS.myFindings}>See my submissions</Link>
      </Button>
    </main>
  )
}

export default NewFindingSuccessPage
