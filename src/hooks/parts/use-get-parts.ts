import { axiosInstance } from '@/lib/api/axios'
import { useQuery } from '@tanstack/react-query'

export const useGetParts = (vehicleId: string) => {
  return useQuery({
    queryKey: ['parts', vehicleId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/vehicles/${vehicleId}/parts`)
      return res.data.parts
    },
    enabled: !!vehicleId,
  })
}
