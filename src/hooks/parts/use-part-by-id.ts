import { axiosInstance } from '@/lib/api/axios'
import { useQuery } from '@tanstack/react-query'

// Get part by ID
export const usePartById = (vehicleId: string, partId: string) => {
  return useQuery({
    queryKey: ['part', vehicleId, partId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/vehicles/${vehicleId}/parts/${partId}`)
      return res.data
    },
    enabled: !!partId
  })
}