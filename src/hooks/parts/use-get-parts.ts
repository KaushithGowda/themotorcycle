import { axiosInstance } from '@/lib/api/axios'
import { useQuery } from '@tanstack/react-query'

type Part = {
  id: string
  name: string
  partNumber: string
  startOdo: string
  endOdo: string
  startDate: string
  endDate: string
  imgUrl: string | null
  createdAt: string
}

export const useGetParts = (vehicleId: string) => {
  return useQuery<Part[]>({
    queryKey: ['parts', vehicleId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/vehicles/${vehicleId}/parts`)
      return res.data.parts
    },
    enabled: !!vehicleId,
  })
}
