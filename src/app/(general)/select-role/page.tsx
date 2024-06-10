import Image from 'next/image'
import {redirect} from 'next/navigation'

import backgroundImage from '@public/images/background-graphic.png'
import SelectRoleButtons from '@/components/sections/profile/SelectRoleButtons'
import {requirePageSession} from '@/server/utils/auth'
import {PATHS} from '@/lib/utils/common/paths'
import {SearchParams} from '@/lib/types/general'

const SelectRolePage = async ({
  searchParams,
}: {
  searchParams?: SearchParams
}) => {
  const session = await requirePageSession()
  const callbackUrl = searchParams?.callbackUrl as string | undefined

  if (session.user.role) {
    redirect(callbackUrl ?? PATHS.home)
  }

  return (
    <main className="relative flex flex-col justify-between py-[147px]">
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
        <h1 className="whitespace-pre-line text-titleL uppercase">
          Confirm your path on our platform
        </h1>
        <div className="mt-12">
          <SelectRoleButtons callbackUrl={callbackUrl} />
        </div>
      </div>
    </main>
  )
}

export default SelectRolePage
