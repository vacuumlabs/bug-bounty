import {cn} from '@/lib/utils/client/tailwind'

type HowItWorksProps = {
  items: {title: string; description: JSX.Element | string}[]
  header?: string
  color?: string
}

const HowItWorks = ({items, header, color = 'bg-grey-90'}: HowItWorksProps) => {
  return (
    <div className="flex flex-col gap-11">
      {header && <h2 className="text-headlineM uppercase">{header}</h2>}
      <div className="flex flex-wrap gap-11">
        {items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={cn(
              'flex flex-grow basis-1/4 flex-col gap-4 border-b border-transparent p-4 hover:border-white hover:bg-white/5',
              color,
            )}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white text-titleM">
              {index + 1}
            </div>
            <span className="text-titleM">{item.title}</span>
            <p className="text-bodyM">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowItWorks
