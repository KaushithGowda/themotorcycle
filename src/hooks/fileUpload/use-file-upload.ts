import { useState } from 'react'
import { axiosInstance } from '@/lib/api/axios'
import { useLoadingState } from '@/store/useLoaderStore'

export function useFileUpload() {
  const [error, setError] = useState<Error | { message?: string } | null>(null)
  const [isError, setIsError] = useState(false)
  const { setLoader } = useLoadingState()

  const upload = async (
    file: File,
    type: 'vehicles' | 'parts' | 'profiles',
    publicId: string
  ): Promise<string | null> => {
    setLoader(true)
    setError({})
    setIsError(false)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      formData.append('publicId', publicId)

      const res = await axiosInstance.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data.secure_url as string
    } catch (err: unknown) {
      setIsError(true)
      if (err instanceof Error) {
        setError(err)
      } else {
        setError({ message: 'Upload failed' })
      }
      return null
    } finally {
      setLoader(false)
    }
  }

  return { upload, error, isError }
}
