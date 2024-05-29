'use client'

import {forwardRef, useState} from 'react'

import Textarea from '../ui/Textarea'
import {Button} from '../ui/Button'
import MarkdownPreview from './MarkdownPreview'

import {cn} from '@/lib/utils/client/tailwind'

type MarkdownEditorProps = {
  className?: string
  value: string | null
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
}

const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  ({className, name, value, onBlur, onChange}, ref) => {
    const [isPreview, setIsPreview] = useState(false)

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <Button
          className="self-end"
          variant="outline"
          onClick={() => setIsPreview(!isPreview)}>
          {isPreview ? 'Edit' : 'Preview'}
        </Button>
        {isPreview ? (
          <MarkdownPreview className="min-h-[400px]" doc={value ?? ''} />
        ) : (
          <Textarea
            ref={ref}
            onBlur={onBlur}
            className="min-h-[400px]"
            onChange={(event) => onChange(event.target.value)}
            value={value ?? ''}
            name={name}
          />
        )}
      </div>
    )
  },
)
MarkdownEditor.displayName = 'MarkdownEditor'

export default MarkdownEditor
