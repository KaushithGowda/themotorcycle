/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/api/axios'

type UpdateProfileInput = {
  name: string
  imgUrl?: string | File | null
}

export const useUpdateProfile = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (err: Error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: UpdateProfileInput) => {
      const formData = new FormData()
      formData.append('name', values.name)
      if (values.imgUrl && typeof values.imgUrl !== 'string') {
        formData.append('imgUrl', values.imgUrl)
      }

      const res = await axiosInstance.patch('/api/profile', formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      onSuccess?.()
    },
    onError: (err) => {
      onError?.(err)
    },
  })
}
