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
      const res = await axiosInstance.post('/api/vehicles', values)
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
