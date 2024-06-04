'use client'

import React, {
  DragEvent,
  forwardRef,
  InputHTMLAttributes,
  useRef,
  useState,
} from 'react'
import {FileCheck2Icon, X} from 'lucide-react'

import {Button} from './Button'

import {Card, CardContent} from '@/components/ui/Card'
import {Input} from '@/components/ui/Input'
import {cn} from '@/lib/utils/client/tailwind'
import {Override} from '@/lib/types/general'

type DropzoneProps = Override<
  InputHTMLAttributes<HTMLInputElement>,
  {
    wrapperClassName?: string
    className?: string
    message: string
    onChange: (acceptedFiles: File[] | null) => void
    value: File[] | null | undefined
  }
>

const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(
  ({className, wrapperClassName, message, onChange, value, ...props}, ref) => {
    const [isDraggedOver, setIsDraggedOver] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDraggedOver(true)
    }

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDraggedOver(false)
    }

    const setFiles = (files: File[]) => {
      // It's not possible to construct FileList directly
      const dataTransfer = new DataTransfer()
      files.forEach((file) => dataTransfer.items.add(file))

      if (inputRef.current) {
        inputRef.current.files = dataTransfer.files
        onChange(files)
      }
    }

    const addFiles = (filelist: FileList) => {
      const files = [...(value ?? []), ...filelist]

      const uniqueFiles = files.filter((file, currentIndex) => {
        const firstOccurrenceIndex = files.findIndex(
          ({name, size}) => name === file.name && size === file.size,
        )

        return firstOccurrenceIndex === currentIndex
      })

      setFiles(uniqueFiles)
    }

    const removeFile = (indexToRemove: number) => {
      if (!value) {
        return
      }

      const files = value.filter((_, index) => index !== indexToRemove)
      setFiles(files)
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDraggedOver(false)

      addFiles(event.dataTransfer.files)
    }

    const triggerFileInputClick = () => {
      if (inputRef.current) {
        inputRef.current.click()
      }
    }

    return (
      <div className={cn('flex flex-col', wrapperClassName)}>
        <Card
          ref={ref}
          className={cn(
            `border-2 border-dashed hover:cursor-pointer hover:border-slate-500 hover:bg-grey-10`,
            isDraggedOver && 'border-slate-500 bg-grey-10',
            className,
          )}>
          <CardContent
            className="flex flex-col items-center justify-center space-y-2 px-2 py-12 text-sm"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInputClick}>
            <div className="pointer-events-none flex items-center justify-center">
              <span className="font-medium">{message}</span>
              <Input
                {...props}
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={({target: {files}}) => files && addFiles(files)}
              />
            </div>
          </CardContent>
        </Card>
        {value?.map((file, index) => (
          <div
            key={`${file.name}-${file.size}`}
            className="relative flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <FileCheck2Icon className="h-4 w-4" />
              <p className="text-sm font-medium">{file.name}</p>
            </div>
            <Button size="icon" onClick={() => removeFile(index)}>
              <X />
            </Button>
          </div>
        ))}
      </div>
    )
  },
)
Dropzone.displayName = 'Dropzone'

export default Dropzone
