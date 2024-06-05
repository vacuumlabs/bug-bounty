'use client'

import {CardanoWallet} from '@meshsdk/react'

import NoSSR from '@/components/helpers/NoSsr'

const ConnectWallet = () => {
  return (
    <NoSSR>
      <CardanoWallet label="Connect your wallet" isDark />
    </NoSSR>
  )
}

export default ConnectWallet
