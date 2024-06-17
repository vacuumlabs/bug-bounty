import {ReactNode} from 'react'

import AuditorsNavbar from '@/components/global/navbars/AuditorsNavbar'

type SubmissionsLayoutProps = {
  children: ReactNode
}

const SubmissionsLayout = ({children}: SubmissionsLayoutProps) => {
  return (
    <>
      <AuditorsNavbar />
      <div className="flex flex-grow flex-col pt-[96px]">{children}</div>
    </>
  )
}

export default SubmissionsLayout
