import Link from 'next/link'
import {cva} from 'class-variance-authority'

import {HomePageTab} from '@/lib/types/enums'

const huntersItems = [
  {
    title: 'Explore',
    description: (
      <span>
        Explore our list of{' '}
        <Link className="underline" href="/#contests">
          Active Bounties
        </Link>{' '}
        and read its details and terms.
      </span>
    ),
  },
  {
    title: 'Login',
    description: (
      <span>
        {'To submit a report, '}
        <Link className="underline" href="/api/auth/signin">
          login
        </Link>
        {' with your account on Google, Twitter or Github.'}
      </span>
    ),
  },
  {
    title: 'Connect a Wallet',
    description: 'Connect your wallet (or review it if already connected).',
  },
  {
    title: 'Report',
    description: 'Write your bug report, review and submit it.',
  },
  {
    title: 'Confirmation',
    description:
      'Wait our contact to confirm results and awards, some days after the contest is over.',
  },
  {
    title: 'Award',
    description:
      'If the bug report is valid, you will receive your award in ADA within some days in your wallet. If the same bug was found by more people, award will be shared.',
  },
]

const projectsItems = [
  {
    title: 'Login',
    description: (
      <span>
        <Link className="underline" href="/api/auth/signin">
          Login
        </Link>
        {' through your Google, Twitter or Github account.'}
      </span>
    ),
  },
  {
    title: 'Description',
    description:
      'Provide information of your project: name, type, language and its description.',
  },
  {
    title: 'Set Parameters',
    description:
      'Define the rewards for the project (in ADA), severity, conditions, known issues and the audit period.',
  },
  {
    title: 'Review Information',
    description:
      'Before submitting your project, review the information provided.',
  },
  {
    title: 'Confirmation',
    description:
      'Wait our contact to confirm the project is valid. If all good, you should transfer the rewards to Bounty Lab and your project will be published.',
  },
  {
    title: 'Return',
    description:
      'If no bugs are found, we will return the reward to the provided address.',
  },
]

const howItWorksItemVariants = cva(
  'flex flex-grow basis-1/4 flex-col gap-4 border-b border-transparent p-4 hover:border-white hover:bg-white/5',
  {
    variants: {
      color: {
        black: 'bg-black',
        grey: 'bg-grey-90',
      },
    },
  },
)

type HowItWorksProps = {
  variant: HomePageTab
}

const HowItWorks = ({variant}: HowItWorksProps) => {
  const items = variant === HomePageTab.HUNTERS ? huntersItems : projectsItems
  const color = variant === HomePageTab.HUNTERS ? 'black' : 'grey'

  return (
    <div className="flex flex-col gap-11">
      <h2 className="text-headlineM uppercase">How it works?</h2>
      <div className="flex flex-wrap gap-11">
        {items.map((item, index) => (
          <div
            key={`${variant}-${index}`}
            className={howItWorksItemVariants({color})}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white text-titleM">
              {index + 1}
            </div>
            <span className="text-titleM">{item.title}</span>
            <p className="text-bodyM">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowItWorks
