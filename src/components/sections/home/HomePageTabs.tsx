'use client'

import Image from 'next/image'

import Contests from '../contest/Contests'
import HowItWorks from './HowItWorks'
import HomePageCta from './HomePageCta'

import Separator from '@/components/ui/Separator'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import overlayImage from '@public/images/transparent-thin-overlay.png'
import {useSearchParamsEnumState} from '@/lib/hooks/useSearchParamsState'
import {HomePageTab} from '@/lib/types/enums'

export const HOMEPAGE_CONTESTS_PAGE_SIZE = 7

const HomePageTabs = () => {
  const [currentTab, {setValue: setCurrentTab}] = useSearchParamsEnumState(
    'tab',
    HomePageTab,
    HomePageTab.HUNTERS,
  )

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <TabsList className="px-24">
        <TabsTrigger value={HomePageTab.HUNTERS}>For hunters</TabsTrigger>
        <TabsTrigger value={HomePageTab.PROJECTS}>For projects</TabsTrigger>
      </TabsList>
      <Separator />
      <TabsContent value={HomePageTab.HUNTERS}>
        <div className="bg-black px-24 pb-[108px] pt-16">
          <Contests pageSize={HOMEPAGE_CONTESTS_PAGE_SIZE} />
        </div>
        <div className="relative overflow-hidden bg-white/5 p-24">
          <Image
            src={overlayImage}
            className="pointer-events-none absolute right-0 top-0 -z-10 h-auto"
            alt="Overlay graphic"
            width={514}
          />
          <HowItWorks variant={HomePageTab.HUNTERS} />
        </div>
      </TabsContent>
      <TabsContent value={HomePageTab.PROJECTS}>
        <div className="overflow-hidden bg-black p-24">
          <HowItWorks variant={HomePageTab.PROJECTS} />
        </div>
      </TabsContent>
      <div className="p-24">
        <HomePageCta variant={currentTab} />
      </div>
    </Tabs>
  )
}

export default HomePageTabs
