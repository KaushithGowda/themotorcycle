import { useMutation, useQueryClient } from '@tanstack/react-query'
import { VehicleSchema } from '@/schemas'
import { z } from 'zod'

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
      Object.entries(values).forEach(([key, val]) =>
        formData.append(key, String(val))
      )

      const res = await fetch('/api/vehicles', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to create vehicle')
      return result
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
