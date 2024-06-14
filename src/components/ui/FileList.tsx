import {FileCheck2Icon, X} from 'lucide-react'

import {Button} from './Button'

import {cn} from '@/lib/utils/client/tailwind'

type FileListProps = {
  className?: string
  files: File[]
  onRemove?: (index: number) => void
}

const FileList = ({className, files, onRemove}: FileListProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-x-12 gap-y-3', className)}>
      {files.map((file, index) => (
        <div
          key={`${file.name}-${file.size}`}
          className="flex items-center gap-2">
          <FileCheck2Icon className="h-4 w-4" />
          <p className="text-buttonS">{file.name}</p>
          {onRemove && (
            <Button variant="ghost" onClick={() => onRemove(index)}>
              <X />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}

export default FileList
