import {ReactNode} from 'react'

import RoleBasedNavbar from '@/components/global/navbars/RoleBasedNavbar/RoleBasedNavbar'

type SubmissionsLayoutProps = {
  children: ReactNode
}

const SubmissionsLayout = ({children}: SubmissionsLayoutProps) => {
  return (
    <>
      <RoleBasedNavbar />
      <div className="flex flex-grow flex-col pt-[96px]">{children}</div>
    </>
  )
}

export default SubmissionsLayout
