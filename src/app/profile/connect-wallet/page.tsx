import VerifyWalletButton from '@/components/sections/profile/VerifyWalletButton'

const ConnectWalletPage = () => {
  return (
    <main className="flex flex-col items-center gap-8 pt-[100px]">
      <h1 className="text-2xl">
        Connect your wallet to add it to your account
      </h1>
      <VerifyWalletButton />
    </main>
  )
}

export default ConnectWalletPage
