'use client'

import { useParams } from 'next/navigation'
import { useVehicleById } from '@/hooks/vehicles/use-vehicle-by-id'
import VehicleForm from '@/components/vehicles/vehicles-form'
import { ErrorState } from '@/components/shared/error-state'
import { EmptyState } from '@/components/shared/empty-state'
import { useToast } from '@/hooks/utils/use-toast'

const EditVehicle = () => {
  const params = useParams()
  const vehicleId = params?.vehicleId as string

  const { data: vehicle, isError, error } = useVehicleById(vehicleId)

  useToast({
    isError,
    errorMsg: error?.message,
  })

  if (!vehicle && !isError) return <EmptyState heading='Vehicle not found' message='No vehicle data available for this ID.' />

  if (isError || !vehicle)
    return <ErrorState heading={error?.name} message={error?.message} />

  return <VehicleForm defaultValues={vehicle} />
}

export default EditVehicle
