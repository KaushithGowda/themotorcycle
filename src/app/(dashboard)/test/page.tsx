'use client'
import { useUsers } from '@/hooks/use-users'

const Test = () => {
  const { data, isLoading, isError } = useUsers()

  if (isLoading) return <p>Loading users...</p>
  if (isError) return <p>Failed to load users.</p>
  console.log({data});

  return (
    <ul>
      {/* {data?.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))} */}
    </ul>
  )
}

export default Test
