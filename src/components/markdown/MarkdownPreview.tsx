import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {cn} from '@/lib/utils/client/tailwind'

type MarkdownPreviewProps = {
  doc: string
  className?: string
}

const MarkdownPreview = ({doc, className}: MarkdownPreviewProps) => {
  return (
    <div
      className={cn(
        'prose min-h-[80px] w-full max-w-none select-text rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-6 ring-offset-white prose-pre:bg-transparent',
        className,
      )}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: (props) => {
            const {children, className, node, ...rest} = props
            const match = /language-(\w+)/.exec(className ?? '')
            return (
              <SyntaxHighlighter
                {...(rest as SyntaxHighlighterProps)}
                PreTag="div"
                language={match ? match[1] : ''}
                style={oneDark}>
                {String(children).trim()}
              </SyntaxHighlighter>
            )
          },
        }}>
        {doc}
      </Markdown>
    </div>
  )
}

export default MarkdownPreview
