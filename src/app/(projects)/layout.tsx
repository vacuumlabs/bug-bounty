import {ReactNode} from 'react'

import RoleBasedNavbar from '@/components/global/navbars/RoleBasedNavbar/RoleBasedNavbar'

type ProjectsLayoutProps = {
  children: ReactNode
}

const ProjectsLayout = ({children}: ProjectsLayoutProps) => {
  return (
    <>
      <RoleBasedNavbar />
      <div className="flex flex-grow flex-col pt-[96px]">{children}</div>
    </>
  )
}

export default ProjectsLayout
