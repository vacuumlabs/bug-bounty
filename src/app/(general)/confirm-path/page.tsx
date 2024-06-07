import Image from 'next/image'
import {redirect} from 'next/navigation'

import backgroundImage from '@public/images/background-graphic.png'
import ConfirmPathButtons from '@/components/sections/profile/ConfirmPathButtons'
import {requirePageSession} from '@/server/utils/auth'
import {PATHS} from '@/lib/utils/common/paths'

const ConfirmPathPage = async () => {
  const session = await requirePageSession()

  if (session.user.role) {
    redirect(PATHS.myProjects)
  }

  return (
    <main className="relative flex flex-col justify-between pt-[200px]">
      <Image
        src={backgroundImage}
        alt="Background image"
        width={514}
        className="opacity-10"
        style={{
          position: 'absolute',
          right: 0,
          top: -136,
          zIndex: -1,
        }}
      />
      <div className="flex flex-col items-center justify-center px-24">
        <h1 className="whitespace-pre-line text-headlineS font-bold uppercase">
          Confirm your path on our platform
        </h1>
        <div className="pt-12">
          <ConfirmPathButtons />
        </div>
      </div>
    </main>
  )
}

export default ConfirmPathPage
