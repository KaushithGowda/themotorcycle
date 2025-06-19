import { axiosInstance } from '@/lib/api/axios'
import { PartSchema } from '@/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

type UpdatePartsProps = {
  vehicleId: string
} & z.infer<typeof PartSchema>

// Create part
export const useCreatePart = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: (err: Error) => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ vehicleId, ...values }: UpdatePartsProps) => {
      const res = await axiosInstance.post(
        `/api/vehicles/${vehicleId}/parts`,
        values
      )
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['part', variables.vehicleId] })
      onSuccess()
    },
    onError: (err) => {
      onError(err)
    },
  })
}
