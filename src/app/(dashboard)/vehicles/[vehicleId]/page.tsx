'use client'

import { useParams } from 'next/navigation'
import { useVehicleById } from '@/hooks/vehicles/use-vehicle-by-id'
import VehicleForm from '@/components/vehicles/vehicles-form'

const EditVehicle = () => {
  const params = useParams()
  const vehicleId = params?.vehicleId as string

  const { data: vehicle, isLoading } = useVehicleById(vehicleId)

  if (isLoading) return <p className='text-center mt-10'>Loading vehicle...</p>
  if (!vehicle) return <p className='text-center mt-10'>Vehicle not found.</p>

  return (
    <div className='w-full flex justify-center flex-col'>
      <VehicleForm defaultValues={vehicle} />
    </div>
  )
}

export default EditVehicle
