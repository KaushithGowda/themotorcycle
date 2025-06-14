'use client'

import ProfileForm from '@/components/profile/profile-form'
import { useGetProfile } from '@/hooks/profile/use-get-profile'

const UpdateProfile = () => {
  const { data, isLoading, isError } = useGetProfile()

  if (isLoading) return <p>Loading...</p>
  if (isError || !data) return <p>Something went wrong</p>

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <ProfileForm defaultValues={data} />
    </div>
  )
}

export default UpdateProfile