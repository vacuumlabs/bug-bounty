'use client'

import {useMemo, useState} from 'react'
import {ArrowLeft, ArrowRight} from 'lucide-react'

import KnowledgeBaseCard from './KnowledgeBaseCard'

import {ArticlesFeedItem} from '@/server/loaders/getArticlesFeed'
import {Button} from '@/components/ui/Button'

const PAGE_SIZE = 3

type KnowledgeBaseProps = {
  articles: ArticlesFeedItem[]
  defaultImageUrl: string
}

const KnowledgeBase = ({articles, defaultImageUrl}: KnowledgeBaseProps) => {
  const [page, setPage] = useState(0)

  const lastPage = Math.floor(articles.length / PAGE_SIZE)

  const visibleArticles = useMemo(
    () => articles.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [articles, page],
  )

  return (
    <div className="flex flex-col px-24">
      <h2 className="mb-3 text-headlineM uppercase">Knowledge base</h2>
      <p>Explore last news and trends about Cardano</p>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {visibleArticles.map((item, index) => (
          <KnowledgeBaseCard
            key={index}
            title={item.title}
            description={item.content}
            imageUrl={item.imageUrl ?? defaultImageUrl}
            href={item.link}
          />
        ))}
      </div>
      <div className="mt-6 flex gap-2.5 self-end">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setPage((value) => value - 1)}
          disabled={page === 0}>
          <ArrowLeft />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setPage((value) => value + 1)}
          disabled={page === lastPage}>
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

export default KnowledgeBase
