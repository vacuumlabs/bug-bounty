import {ReactNode} from 'react'

import ProjectsNavbar from '@/components/global/navbars/ProjectsNavbar'

type ProjectsLayoutProps = {
  children: ReactNode
}

const ProjectsLayout = ({children}: ProjectsLayoutProps) => {
  return (
    <>
      <ProjectsNavbar />
      <div className="flex flex-grow flex-col pt-[96px]">{children}</div>
    </>
  )
}

export default ProjectsLayout
