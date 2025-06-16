/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/api/axios'

type UpdateProfileInput = {
  name: string
  image?: string | File | null
  phoneNumber?: string
  dexp?: string
  rexp?: string
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
      console.log({values});
        
      if (values.phoneNumber) {
        formData.append('phoneNumber', values.phoneNumber)
      }
      if (values.dexp) {
        formData.append('dexp', values.dexp)
      }
      if (values.rexp) {
        formData.append('rexp', values.rexp)
      }
      if (values.image && typeof values.image === 'string') {
        formData.append('image', values.image)
      }

      for (const [key,value] of formData) {
        console.log(key, value);
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
