import Link from 'next/link'

const items = [
  {
    title: 'Explore',
    description: (
      <span>
        Explore our list of{' '}
        <Link className="underline" href="/contests">
          Active Bounties
        </Link>{' '}
        and read its details and terms.
      </span>
    ),
  },
  {
    title: 'Sign in',
    description: (
      <span>
        Explore our list of{' '}
        <Link className="underline" href="/contests">
          Active Bounties
        </Link>{' '}
        and read its details and terms.
      </span>
    ),
  },
  {
    title: 'Connect',
    description: (
      <span>
        Explore our list of{' '}
        <Link className="underline" href="/contests">
          Active Bounties
        </Link>{' '}
        and read its details and terms.
      </span>
    ),
  },
  {
    title: 'Report',
    description: (
      <span>
        Explore our list of{' '}
        <Link className="underline" href="/contests">
          Active Bounties
        </Link>{' '}
        and read its details and terms.
      </span>
    ),
  },
  {
    title: 'Wait',
    description: (
      <span>
        Explore our list of{' '}
        <Link className="underline" href="/contests">
          Active Bounties
        </Link>{' '}
        and read its details and terms.
      </span>
    ),
  },
  {
    title: 'Win',
    description: (
      <span>
        Explore our list of{' '}
        <Link className="underline" href="/contests">
          Active Bounties
        </Link>{' '}
        and read its details and terms.
      </span>
    ),
  },
]

const HowItWorks = () => {
  return (
    <div className="flex flex-col gap-11">
      <h2 className="text-headlineM uppercase">How it works?</h2>
      <div className="flex flex-wrap gap-11">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-grow basis-1/4 flex-col gap-4 border-b border-transparent p-4 hover:border-white hover:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white text-titleM font-bold">
              {index + 1}
            </div>
            <span className="text-buttonL">{item.title}</span>
            <p className="text-bodyS">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowItWorks
