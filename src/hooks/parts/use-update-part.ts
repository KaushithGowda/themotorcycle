import { axiosInstance } from '@/lib/api/axios'
import { PartSchema } from '@/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

type UpdatePartInput = {
  partId: string
  vehicleId: string
} & z.infer<typeof PartSchema>

// Update part
export const useUpdatePart = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: (err: Error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ partId, vehicleId, ...values }: UpdatePartInput) => {
      const res = await axiosInstance.patch(
        `/api/vehicles/${vehicleId}/parts/${partId}`,
        values
      )
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['part', variables.partId],
      })
      onSuccess()
    },
    onError: (err) => {
      onError(err)
    },
  })
}
