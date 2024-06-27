import Link from 'next/link'
import {cva} from 'class-variance-authority'

import {AboutUsTab, HomePageTab} from '@/lib/types/enums'
import {PATHS} from '@/lib/utils/common/paths'

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
        <Link className="underline" href={PATHS.signIn}>
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
        <Link className="underline" href={PATHS.signIn}>
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

const aboutUsHuntersItems = [
  {
    title: 'Exploration',
    description:
      'Hunters start by browsing through a list of active bounties, familiarizing themselves with the details and terms of each project.',
  },
  {
    title: 'Login',
    description:
      'To submit a report, hunters must log in using their Google, Twitter, or GitHub account.',
  },
  {
    title: 'Wallet Connection',
    description:
      'Hunters connect their digital wallet to their account, or review it if it is already connected.',
  },
  {
    title: 'Report',
    description:
      'Hunters write and submit a detailed report about the bug they have discovered and submit it.',
  },
  {
    title: 'Confirmation',
    description:
      'After submission, hunters await a response from the program administrators, who will confirm the results and any awards after the contest concludes.',
  },
  {
    title: 'Awards',
    description:
      'Valid bug reports are rewarded with ADA cryptocurrency, which is deposited directly into the hunter’s digital wallet. If multiple hunters report the same bug, the reward is shared among them.',
  },
]

const aboutUsProjectsItems = [
  {
    title: 'Login',
    description:
      'Project owners log in using their Google, Twitter, or GitHub account.',
  },
  {
    title: 'Description',
    description:
      'Owners provide detailed information about their project, including its name, type, language, and description.',
  },
  {
    title: 'Parameter Settings',
    description:
      'Owners define the rewards for their project (in ADA), set the severity levels, conditions, known issues, and specify the audit period.',
  },
  {
    title: 'Review Information',
    description:
      'Before submission, owners review all the provided information to ensure accuracy.',
  },
  {
    title: 'Confirmation',
    description:
      'After submission, project owners wait for Bounty Lab to confirm the project’s validity. Once confirmed, owners transfer the rewards to Bounty Lab, and the project is published.',
  },
  {
    title: 'Return',
    description:
      'If no bugs are found during the audit period, Bounty Lab returns the reward to the provided address.',
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
  variant: HomePageTab | AboutUsTab
}

const HowItWorks = ({variant}: HowItWorksProps) => {
  const isAboutUs =
    variant === AboutUsTab.HUNTERS || variant === AboutUsTab.PROJECTS

  const getItems = () => {
    switch (variant) {
      case HomePageTab.HUNTERS:
        return huntersItems
      case HomePageTab.PROJECTS:
        return projectsItems
      case AboutUsTab.HUNTERS:
        return aboutUsHuntersItems
      case AboutUsTab.PROJECTS:
        return aboutUsProjectsItems
    }
  }

  const getColors = () => {
    switch (variant) {
      case HomePageTab.HUNTERS:
        return 'black'
      case HomePageTab.PROJECTS:
        return 'grey'
      case AboutUsTab.HUNTERS:
        return 'black'
      case AboutUsTab.PROJECTS:
        return 'black'
    }
  }

  return (
    <div className="flex flex-col gap-11">
      {!isAboutUs && (
        <h2 className="text-headlineM uppercase">How it works?</h2>
      )}
      <div className="flex flex-wrap gap-11">
        {getItems().map((item, index) => (
          <div
            key={`${variant}-${index}`}
            className={howItWorksItemVariants({color: getColors()})}>
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
