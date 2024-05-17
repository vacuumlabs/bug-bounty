import Link from 'next/link'
import React, {ComponentProps} from 'react'

type MaybeLinkProps = Partial<ComponentProps<typeof Link>>

const MaybeLink: React.FC<MaybeLinkProps> = ({href, ...props}) =>
  href ? <Link href={href} {...props} /> : <>{props.children}</>

export default MaybeLink
