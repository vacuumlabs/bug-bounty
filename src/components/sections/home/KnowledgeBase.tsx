'use client'

import {useMemo, useState} from 'react'

import KnowledgeBaseCard from './KnowledgeBaseCard'

import {ArticlesFeedItem} from '@/server/loaders/getArticlesFeed'

const PAGE_SIZE = 3

type KnowledgeBaseProps = {
  articles: ArticlesFeedItem[]
  defaultImageUrl: string
}

const KnowledgeBase = ({articles, defaultImageUrl}: KnowledgeBaseProps) => {
  const [page, setPage] = useState(0)

  const visibleArticles = useMemo(
    () => articles.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [articles, page],
  )

  return (
    <div className="flex flex-col px-24">
      <h2 className="mb-3 text-headlineM uppercase">Knowledge base</h2>
      <p>Explore last news and trends about Cardano</p>
      <div className="mt-12 flex flex-col flex-wrap gap-6 md:flex-row">
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
    </div>
  )
}

export default KnowledgeBase
