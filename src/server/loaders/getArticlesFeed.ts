import Parser from 'rss-parser'
import {z} from 'zod'
import {stripHtml} from 'string-strip-html'
import {parse} from 'node-html-parser'

const MEDIUM_RSS_URL = 'https://medium.com/@vacuumlabs_auditing/feed'

const feedItemSchema = z
  .object({
    creator: z.string(),
    title: z.string(),
    link: z.string(),
    'content:encoded': z.string(),
    guid: z.string(),
    categories: z.array(z.string()),
    isoDate: z.string().datetime(),
  })
  .transform(({'content:encoded': encodedContent, ...item}) => {
    const {result} = stripHtml(encodedContent)
    const imageUrl = parse(encodedContent)
      .querySelector('img')
      ?.getAttribute('src')

    return {
      ...item,
      content: result,
      imageUrl,
    }
  })

const feedSchema = z.object({
  feedUrl: z.string().url(),
  image: z.object({
    url: z.string().url(),
    title: z.string(),
    link: z.string().url(),
  }),
  title: z.string(),
  description: z.string(),
  webMaster: z.string(),
  generator: z.string(),
  link: z.string().url(),
  items: z.array(feedItemSchema),
})

export type ArticlesFeedItem = z.infer<typeof feedItemSchema>
export type ArticlesFeed = z.infer<typeof feedSchema>

export const getArticlesFeed = async () => {
  const rssParser = new Parser()
  const feed = await rssParser.parseURL(MEDIUM_RSS_URL)

  return feedSchema.parse(feed)
}
