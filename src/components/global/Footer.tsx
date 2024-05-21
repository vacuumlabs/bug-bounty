import Image from 'next/image'
import Link from 'next/link'

import {Separator} from '../ui/Separator'
import {Button} from '../ui/Button'

import vacuumlabsLogo from '@public/images/vacuumlabs-logo-light.png'

const footerLinks = [
  {
    title: 'For hunters',
    url: '/contests',
  },
  {
    title: 'For projects',
    url: '/projects',
  },
  {
    title: 'About us',
    url: '/about-us',
  },
  {
    title: 'Login',
    url: '/api/auth/signin',
  },
  {
    title: 'Privacy policy',
    url: '#', // TODO
  },
  {
    title: 'GDPR',
    url: '#', // TODO
  },
  {
    title: 'Vacuumlabs',
    url: 'https://vacuumlabs.com/',
  },
]

const Footer = () => {
  return (
    <div>
      <Separator className="h-[0.5px]" />
      <div className="flex flex-col items-center gap-10 p-24">
        <div className="flex items-end gap-3">
          <span className="relative top-1 uppercase text-white/60">
            Developed by
          </span>
          <Image
            src={vacuumlabsLogo}
            alt="Vacuumlabs logo"
            width={156}
            height={23}
          />
        </div>
        <nav className="flex items-center gap-10">
          {footerLinks.map(({title, url}) => (
            <Button key={title} asChild variant="link">
              <Link className="uppercase text-white/60" href={url}>
                {title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Footer
