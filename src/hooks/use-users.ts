import { getUsers } from "@/lib/api/user"
import { useQuery } from "@tanstack/react-query"

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsers
    })
}