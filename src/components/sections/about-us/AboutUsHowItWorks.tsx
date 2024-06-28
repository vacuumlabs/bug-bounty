import HowItWorks from '../../ui/HowItWorks'

import {AboutUsTab} from '@/lib/types/enums'

const huntersItems = [
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

const projectsItems = [
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

type AboutUsHowItWorksProps = {
  variant: AboutUsTab
}

const AboutUsHowItWorks = ({variant}: AboutUsHowItWorksProps) => {
  const items = variant === AboutUsTab.HUNTERS ? huntersItems : projectsItems

  return <HowItWorks items={items} color="bg-black" />
}

export default AboutUsHowItWorks
