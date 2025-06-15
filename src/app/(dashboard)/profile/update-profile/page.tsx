'use client'

import ProfileForm from '@/components/profile/profile-form'
import { useGetProfile } from '@/hooks/profile/use-get-profile'
import { useToast } from '@/hooks/utils/use-toast'
import { ErrorState } from '@/components/shared/error-state'

const UpdateProfile = () => {
  const { data, isLoading, isError, error } = useGetProfile()

  useToast({
    isError,
    errorMsg: error?.message,
    isLoading,
  })

  if (isError || !data)
    return <ErrorState heading={error?.name} message={error?.message} />

  return (
    <div className='p-6 max-w-4xl'>
      <h2 className='text-2xl font-bold mb-4'>Edit Profile</h2>
      <ProfileForm defaultValues={data} />
    </div>
  )
}

export default UpdateProfile
