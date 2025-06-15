'use client'

import PartsForm from '@/components/parts/parts-form'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { usePartById } from '@/hooks/parts/use-part-by-id'
import { useToast } from '@/hooks/utils/use-toast'
import { useParams } from 'next/navigation'

const EditPart = () => {
  const params = useParams()
  const vehicleId = params?.vehicleId as string
  const partId = params?.partId as string

  const {
    data: vehicle,
    isLoading,
    error,
    isError,
  } = usePartById(vehicleId, partId)

  useToast({
    isError,
    errorMsg: error?.message,
    isLoading,
  })

  if (!vehicle && !isError)
    return (
      <EmptyState
        heading='Vehicle not found'
        message='No vehicle data available for this ID.'
      />
    )

  if (isError || !vehicle)
    return <ErrorState heading={error?.name} message={error?.message} />

  return (
    <div className='w-full flex justify-center flex-col'>
      <PartsForm defaultValues={vehicle} />
    </div>
  )
}

export default EditPart
