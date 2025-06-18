import { useMutation, useQueryClient } from '@tanstack/react-query'
import { VehicleSchema } from '@/schemas'
import { z } from 'zod'
import { axiosInstance } from '@/lib/api/axios'

type UpdateVehicleProps = {
  vehicleId: string
} & z.infer<typeof VehicleSchema>

export const useUpdateVehicle = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: (err: Error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ vehicleId, ...values }: UpdateVehicleProps) => {
      const res = await axiosInstance.patch(
        `/api/vehicles/${vehicleId}`,
        values
      )
      return res.data
    },
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['vehicle', variables.vehicleId],
      })
      onSuccess()
    },
    onError: (err) => {
      onError(err as Error)
    },
  })
}
