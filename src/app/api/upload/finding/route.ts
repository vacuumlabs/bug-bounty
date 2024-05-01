import {handleUpload, type HandleUploadBody} from '@vercel/blob/client'
import {NextResponse} from 'next/server'

import {requireServerSession} from '@/server/utils/auth'

export const POST = async (request: Request): Promise<NextResponse> => {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_, clientPayload) => {
        await requireServerSession()

        return {
          maximumSizeInBytes: 4 * 1024 * 1024, // 4 MB
          tokenPayload: clientPayload,
        }
      },
      onUploadCompleted: async () => {
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      {error: (error as Error).message},
      {status: 400}, // The webhook will retry 5 times waiting for a 200
    )
  }
}
