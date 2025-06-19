'use client'

import ProfileForm from '@/components/profile/profile-form'
import { useGetProfile } from '@/hooks/profile/use-get-profile'
import { useToast } from '@/hooks/utils/use-toast'
import { ErrorState } from '@/components/shared/error-state'
import { EmptyState } from '@/components/shared/empty-state'

const UpdateProfile = () => {
  const { data, isError, error } = useGetProfile()

  useToast({
    isError,
    errorMsg: error?.message,
  })

  if (!data && !isError) return <EmptyState heading='Data not found!' message='Profile data not found' />

  if (isError)
    return <ErrorState heading={error?.name} message={error?.message} />

  return (
    <div className='mx-auto space-y-5 sm:space-y-10'>
      <div className='mb-5 sm:mb-10'>
        <span className='text-2xl font-bold'>Update Your Profile</span>
      </div>
      <ProfileForm defaultValues={data} />
    </div>
  )
}

export default UpdateProfile
