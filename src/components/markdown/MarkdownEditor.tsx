'use client'

import {useState} from 'react'

import {Textarea} from '../ui/Textarea'
import {Button} from '../ui/Button'
import MarkdownPreview from './MarkdownPreview'

const MarkdownEditor = () => {
  const [doc, setDoc] = useState('')
  const [isPreview, setIsPreview] = useState(false)

  return (
    <div className="w-full">
      <div className="pb-2">
        <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
          {isPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>
      {isPreview ? (
        <MarkdownPreview className="min-h-[160px]" doc={doc} />
      ) : (
        <Textarea
          className="min-h-[160px]"
          onChange={(event) => setDoc(event.target.value)}
          value={doc}
        />
      )}
    </div>
  )
}

export default MarkdownEditor
