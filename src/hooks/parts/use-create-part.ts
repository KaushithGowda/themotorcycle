import { axiosInstance } from "@/lib/api/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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
    mutationFn: async (values: { vehicleId: string; [key: string]: unknown }) => {
      const formData = new FormData()
      const { vehicleId, ...rest } = values
      console.log({vehicleId});
      
      Object.entries(rest).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, String(val))
        }
      })
      const res = await axiosInstance.post(`/api/vehicles/${vehicleId}/parts`, formData)
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