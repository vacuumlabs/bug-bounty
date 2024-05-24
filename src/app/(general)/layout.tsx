import {ReactNode} from 'react'

import Navbar from '@/components/global/navbars/Navbar'

type GeneralLayoutProps = {
  children: ReactNode
}

const GeneralLayout = ({children}: GeneralLayoutProps) => {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col pt-[136px]">{children}</div>
    </>
  )
}

export default GeneralLayout
