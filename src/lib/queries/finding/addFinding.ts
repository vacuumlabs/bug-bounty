import {MutateOptions, useMutation} from '@tanstack/react-query'
import {upload} from '@vercel/blob/client'

import {
  AddFinding,
  AddFindingResponse,
  addFinding,
} from '@/server/actions/finding/addFinding'
import {withApiErrorHandler} from '@/lib/utils/common/error'

type AddFindingRequest = {
  finding: AddFinding
  attachments?: File[]
}

const addFindingWithAttachments = async ({
  finding,
  attachments,
}: AddFindingRequest) => {
  if (!attachments) {
    return addFinding({finding, attachments: []})
  }

  const blobs = attachments.map((attachment) =>
    upload(attachment.name, attachment, {
      access: 'public',
      handleUploadUrl: '/api/upload/finding',
    }),
  )

  const uploadedBlobs = await Promise.all(blobs)

  return addFinding({
    finding,
    attachments: uploadedBlobs.map((blob) => ({
      attachmentUrl: blob.url,
      mimeType: blob.contentType,
    })),
  })
}

export const useAddFinding = (
  options?: MutateOptions<AddFindingResponse, Error, AddFindingRequest>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(addFindingWithAttachments),
    // TODO: invalidate relevant GET queries
  })
}
