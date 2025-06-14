import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/api/axios'

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/profile')
      return response.data
    },
  })
}
