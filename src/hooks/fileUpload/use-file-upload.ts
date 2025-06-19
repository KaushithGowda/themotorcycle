import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/api/axios'

export function useFileUpload() {
  const mutation = useMutation({
    mutationFn: async ({
      file,
      type,
      publicId,
    }: {
      file: File
      type: 'vehicles' | 'parts' | 'profiles'
      publicId: string
    }) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      formData.append('publicId', publicId)

      const res = await axiosInstance.post('/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return res.data.secure_url as string
    },
  })

  return {
    upload: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
