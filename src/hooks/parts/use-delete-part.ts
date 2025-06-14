import { axiosInstance } from "@/lib/api/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// Delete part
export const useDeletePart = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: (err: Error) => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/api/parts/${id}`)
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