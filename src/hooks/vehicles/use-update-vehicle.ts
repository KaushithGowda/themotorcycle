/* eslint-disable @typescript-eslint/no-explicit-any */
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
      const formData = new FormData()

      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof File !== 'undefined' && value instanceof File) {
            formData.append(key, value)
          } else if (value !== '') {
            formData.append(key, String(value))
          }
        }
      })

      const res = await axiosInstance.patch(
        `/api/vehicles/${vehicleId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return res.data
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['vehicle', variables.vehicleId],
      })
      await queryClient.refetchQueries({
        queryKey: ['vehicle', variables.vehicleId],
      })
      onSuccess()
    },
    onError: (err) => {
      onError(err as Error)
    },
  })
}
