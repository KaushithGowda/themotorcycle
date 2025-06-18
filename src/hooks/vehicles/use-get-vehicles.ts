import { axiosInstance } from '@/lib/api/axios'
import { useQuery } from '@tanstack/react-query'

export const useGetVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/vehicles')
      return res?.data?.vehicles || []
    },
  })
}
