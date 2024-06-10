'use client'

import Image from 'next/image'
import {useState} from 'react'
import {useRouter} from 'next/navigation'

import hunterBadgeImage from '@public/images/hunter-badge.png'
import projectOwnerBadgeImage from '@public/images/project-owner-badge.png'
import {cn} from '@/lib/utils/client/tailwind'
import {Button} from '@/components/ui/Button'
import {useSetUserRole} from '@/lib/queries/user/setUserRole'
import {SetUserRoleEnum} from '@/server/actions/user/setUserRole'
import {UserRole} from '@/server/db/models'
import {PATHS} from '@/lib/utils/common/paths'

type SelectRoleButtonsProps = {
  callbackUrl: string | undefined
}

const SelectRoleButtons = ({callbackUrl}: SelectRoleButtonsProps) => {
  const router = useRouter()
  const [selectedPath, setSelectedPath] = useState<SetUserRoleEnum>(
    UserRole.AUDITOR,
  )

  const {mutateAsync, isPending} = useSetUserRole()

  const onConfirm = async () => {
    await mutateAsync(selectedPath)

    if (selectedPath === UserRole.AUDITOR) {
      router.push(`${PATHS.connectWallet}?callbackUrl=${callbackUrl}`)
      return
    }

    router.push(callbackUrl ?? PATHS.home)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex gap-6">
        <button
          className={cn(
            'flex h-[260px] w-[460px] flex-col items-center justify-center gap-4 border-b-2 border-grey-90 bg-grey-90',
            selectedPath === UserRole.AUDITOR && 'border-white',
          )}
          onClick={() => setSelectedPath(UserRole.AUDITOR)}>
          <Image
            src={hunterBadgeImage}
            alt="Hunter badge"
            width={120}
            height={120}
          />
          <span className="text-xl font-semibold">Hunter</span>
          <p>I want to hunt for bugs and earn rewards.</p>
        </button>
        <button
          className={cn(
            'flex h-[260px] w-[460px] flex-col items-center justify-center gap-4 border-b-2 border-grey-90 bg-grey-90',
            selectedPath === UserRole.PROJECT_OWNER && 'border-white',
          )}
          onClick={() => setSelectedPath(UserRole.PROJECT_OWNER)}>
          <Image
            src={projectOwnerBadgeImage}
            alt="Project badge"
            width={120}
            height={120}
          />
          <span className="text-xl font-semibold">Project</span>
          <p>I want my project to be audited by expert bug hunters.</p>
        </button>
      </div>

      <div className="pt-16">
        <Button variant="default" disabled={isPending} onClick={onConfirm}>
          {isPending ? 'Loading...' : 'Confirm'}
        </Button>
      </div>
    </div>
  )
}

export default SelectRoleButtons
