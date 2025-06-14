import { axiosInstance } from "@/lib/api/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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
    mutationFn: async ({ partId, vehicleId, ...values }: any) => {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, String(val))
        }
      })
      const res = await axiosInstance.patch(`/api/vehicles/${vehicleId}/parts/${partId}`, formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] })
      onSuccess()
    },
    onError: (err) => {
      onError(err)
    },
  })
}