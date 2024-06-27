import Image from 'next/image'

import backgroundImage from '@public/images/background-graphic.png'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import AboutUsTabs from '@/components/sections/about-us/AboutUsTabs'

const AboutUs = () => {
  return (
    <main className="relative flex flex-col justify-between">
      <Image
        src={backgroundImage}
        alt="Background image"
        width={514}
        style={{
          position: 'absolute',
          right: 0,
          top: -136,
          zIndex: -1,
        }}
      />
      <div className="flex h-[248px] items-center p-24">
        <h1 className="text-headlineL uppercase">About bounty lab</h1>
      </div>
      <div className="min-h-[504px] w-full border-t-[1px] bg-gradient-to-tl from-black backdrop-blur-xl">
        <div className="grid grid-cols-2 items-center p-24">
          <div className="flex flex-col gap-6">
            <div className="h-[1px] w-[76px] bg-white" />
            <span className="text-titleL">Engaging communities</span>
            <div className="h-[1px] w-[76px] bg-white" />
            <span className="text-titleL">Driving opportunities</span>
            <div className="h-[1px] w-[76px] bg-white" />
            <span className="text-titleL">Securing ecosystems</span>
          </div>

          <div>
            <p>
              We at Bounty Lab are a community-driven Bug Bounty platform
              operating on the Cardano Blockchain. Acknowledging the critical
              role of security in blockchain projects, we foster an ecosystem
              where developers can submit their projects for thorough auditing.
              Users are incentivized with ADA rewards to identify and report
              vulnerabilities, thereby enhancing project security and promoting
              collaboration within the ecosystem.
            </p>
            <br />
            <p>
              We engage both seasoned auditors and enthusiastic community
              members, offering a unique mix of expertise and fresh
              perspectives. By implementing rigorous security measures, we
              contribute significantly to the overall integrity and reliability
              of the Cardano ecosystem.
            </p>
            <br />
            <p>
              We proudly combine community engagement with professional
              auditing, providing benefits to developers, auditors, and the
              Cardano network as a whole.
            </p>
          </div>
        </div>
      </div>
      <HydrationBoundary>
        <AboutUsTabs />
      </HydrationBoundary>
    </main>
  )
}

export default AboutUs
