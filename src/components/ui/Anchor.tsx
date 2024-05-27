import {cn} from '@/lib/utils/client/tailwind'

type AnchorProps = {
  className?: string
  id: string
}

const Anchor: React.FC<AnchorProps> = ({className, id}) => (
  <span id={id} className={cn('relative -top-[150px]', className)} />
)

export default Anchor
