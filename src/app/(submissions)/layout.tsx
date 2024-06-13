import {ReactNode} from 'react'

import SubmissionsNavbar from '@/components/global/navbars/SubmissionsNavbar'

type SubmissionsLayoutProps = {
  children: ReactNode
}

const SubmissionsLayout = ({children}: SubmissionsLayoutProps) => {
  return (
    <>
      <SubmissionsNavbar />
      <div className="flex flex-grow flex-col pt-[96px]">{children}</div>
    </>
  )
}

export default SubmissionsLayout
