import {ReactNode} from 'react'

import Navbar from '@/components/global/navbars/Navbar'

type GeneralLayoutProps = {
  children: ReactNode
}

const GeneralLayout = ({children}: GeneralLayoutProps) => {
  return (
    <>
      <Navbar />
      <div className="flex flex-grow flex-col pt-[136px]">{children}</div>
    </>
  )
}

export default GeneralLayout
