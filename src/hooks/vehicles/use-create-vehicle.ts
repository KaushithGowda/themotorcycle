/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { VehicleSchema } from '@/schemas'
import { z } from 'zod'
import { axiosInstance } from '@/lib/api/axios'

export const useCreateVehicle = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: (err: Error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: z.infer<typeof VehicleSchema>) => {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          if (typeof val === 'object' && typeof File !== 'undefined') {
            formData.append(key, val)
          } else if (val !== '') {
            formData.append(key, String(val))
          }
        }
      })
      for (const [key, value] of formData.entries()) {
        console.log(key, value)
      }

      const res = await axiosInstance.post('/api/vehicles', formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      onSuccess()
    },
    onError: (err) => {
      onError(err as Error)
    },
  })
}
