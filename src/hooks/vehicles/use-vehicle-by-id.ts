import { axiosInstance } from '@/lib/api/axios'
import { useQuery } from '@tanstack/react-query'

export const useVehicleById = (id: string) => {
  return useQuery({
    queryKey: ['vehicleWithId', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/vehicles/${id}`)
      return res.data
    },
  })
}
