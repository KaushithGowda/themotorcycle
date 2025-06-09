import { axiosInstance } from '@/lib/api/axios'
import { useQuery } from '@tanstack/react-query'

type Vehicle = {
  id: string
  make: string
  model: string
  color: string
  year: number
  odoReading: number
  regNumber: string
  imgUrl: string | null
  createdAt: string
}

export const useGetVehicles = () => {
  return useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/vehicles')
      return res.data.vehicles
    },
  })
}
