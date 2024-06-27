'use client'

import HowItWorks from '../home/HowItWorks'

import {useSearchParamsEnumState} from '@/lib/hooks/useSearchParamsState'
import {AboutUsTab} from '@/lib/types/enums'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/Tabs'

const AboutUsTabs = () => {
  const [currentTab, {setValue: setCurrentTab}] = useSearchParamsEnumState(
    'tab',
    AboutUsTab,
    AboutUsTab.HUNTERS,
  )

  return (
    <div className="bg-grey-90 p-24">
      <h2 className="mb-12 text-headlineM uppercase">How bounty labs works</h2>
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value={AboutUsTab.HUNTERS}>For hunters</TabsTrigger>
          <TabsTrigger value={AboutUsTab.PROJECTS}>
            For project owners
          </TabsTrigger>
        </TabsList>
        <TabsContent value={AboutUsTab.HUNTERS}>
          <div className="pt-6">
            <HowItWorks variant={AboutUsTab.HUNTERS} />
          </div>
        </TabsContent>
        <TabsContent value={AboutUsTab.PROJECTS}>
          <div className="pt-6">
            <HowItWorks variant={AboutUsTab.PROJECTS} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AboutUsTabs
