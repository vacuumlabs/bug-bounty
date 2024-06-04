import {ArrowRight} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import {Button} from '@/components/ui/Button'
import Separator from '@/components/ui/Separator'
import {cn} from '@/lib/utils/client/tailwind'
import {ellipsizeText} from '@/lib/utils/common/format'

export type KnowledgeBaseCardProps = {
  title: string
  description: string
  href: string
  imageUrl: string
  className?: string
}

const KnowledgeBaseCard = ({
  title,
  description,
  href,
  imageUrl,
  className,
}: KnowledgeBaseCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 overflow-hidden border-b-2 border-transparent bg-grey-90 p-6 hover:border-b-white',
        className,
      )}>
      <div className="relative h-[200px]">
        <Image src={imageUrl} fill alt="Article picture" />
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-titleM">{title}</span>
        <Separator className="w-11" />
        <p className="text-bodyS">{ellipsizeText(description, 230)}</p>
      </div>
      <Button
        asChild
        variant="outline"
        size="small"
        className="mt-auto self-start">
        <Link href={href} target="_blank">
          Read more
          <ArrowRight className="ml-2" />
        </Link>
      </Button>
    </div>
  )
}

export default KnowledgeBaseCard
