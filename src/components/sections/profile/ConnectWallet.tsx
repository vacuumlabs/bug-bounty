'use client'

import {CardanoWallet} from '@meshsdk/react'

import NoSSR from '@/components/helpers/NoSsr'

const ConnectWallet = () => {
  return (
    <NoSSR>
      <CardanoWallet />
    </NoSSR>
  )
}

export default ConnectWallet
