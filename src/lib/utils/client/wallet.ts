import {BrowserWallet} from '@meshsdk/core'

// MeshSDK returns empty object as BrowserWallet, when wallet is not connected
export const isWalletConnected = (wallet: BrowserWallet) =>
  Object.keys(wallet).length > 0

export const connectWallet = async () => {
  const wallet = BrowserWallet.getInstalledWallets()[0]

  if (!wallet) {
    throw new Error('No wallet found.')
  }

  return BrowserWallet.enable(wallet.name)
}

export const requireConnectedWallet = async (wallet: BrowserWallet) =>
  isWalletConnected(wallet) ? wallet : connectWallet()
