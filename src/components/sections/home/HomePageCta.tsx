'use client'

import {ArrowRight} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import {Button} from '@/components/ui/Button'
import overlayImage from '@public/images/transparent-thin-overlay.png'
import {HomePageTab} from '@/lib/types/enums'
import {DISCORD_URL, PATHS} from '@/lib/utils/common/paths'

const data = {
  [HomePageTab.HUNTERS]: {
    title: 'Still wondering?',
    text: "The future of DeFi hinges on your expertise. Join our elite bug bounty program & become a guardian of Cardano's security. Uncover vulnerabilities & safeguard the Cardano ecosystem - while earning rewards in ADA.",
    leftButton: {
      title: 'Join the community',
      href: DISCORD_URL,
    },
    rightButton: {
      title: 'Explore bounties',
      href: '/#contests',
    },
  },
  [HomePageTab.PROJECTS]: {
    title: 'Get protected',
    text: 'Uncover vulnerabilities before they exploit you. Submit your Cardano project to our Bug Bounty program and gain access to a pool of skilled blockchain hunters. Secure your future and help to build a stronger Cardano ecosystem.',
    leftButton: {
      title: 'Join the community',
      href: DISCORD_URL,
    },
    rightButton: {
      title: 'Submit my project',
      href: PATHS.newProject,
    },
  },
}

type HomePageCtaProps = {
  variant: HomePageTab
}

const HomePageCta = ({variant}: HomePageCtaProps) => {
  const {title, text, leftButton, rightButton} = data[variant]

  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-full bg-purple px-24 py-11 text-black">
      <Image
        src={overlayImage}
        className="absolute -right-24 top-0 h-auto"
        alt="Overlay graphic"
        width={514}
      />
      <h3 className="text-headlineM uppercase">{title}</h3>
      <p className="mb-11 mt-6 text-center text-bodyL">{text}</p>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href={leftButton.href}>{leftButton.title}</Link>
        </Button>
        <Button asChild variant="default">
          <Link href={rightButton.href} className="gap-2">
            {rightButton.title}
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default HomePageCta
