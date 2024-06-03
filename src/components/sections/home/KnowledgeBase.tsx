import KnowledgeBaseCard, {KnowledgeBaseCardProps} from './KnowledgeBaseCard'

const mockData: KnowledgeBaseCardProps[] = [
  {
    title: 'Will Ethereum beat bitcoin?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor metus a felis bibendum, cursus dictum dolor pellentesque. Proin aliquet in tellus vel vestibulum. Maecenas quis varius orci...',
    href: '#',
    imageUrl: 'https://picsum.photos/352/200',
  },
  {
    title: 'Will Ethereum beat bitcoin?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor metus a felis bibendum, cursus dictum dolor pellentesque. Proin aliquet in tellus vel vestibulum. Maecenas quis varius orci...',
    href: '#',
    imageUrl: 'https://picsum.photos/352/200',
  },
  {
    title: 'Will Ethereum beat bitcoin?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor metus a felis bibendum, cursus dictum dolor pellentesque. Proin aliquet in tellus vel vestibulum. Maecenas quis varius orci...',
    href: '#',
    imageUrl: 'https://picsum.photos/352/200',
  },
]

const KnowledgeBase = () => {
  return (
    <div className="flex flex-col px-24">
      <h2 className="mb-3 text-headlineM uppercase">Knowledge base</h2>
      <p>Explore last news and trends about Cardano</p>
      <div className="mt-12 flex flex-col gap-6 md:flex-row">
        {mockData.map((item, index) => (
          <KnowledgeBaseCard key={index} {...item} />
        ))}
      </div>
    </div>
  )
}

export default KnowledgeBase
