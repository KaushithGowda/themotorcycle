'use client'

import PartsForm from '@/components/parts/parts-form'
import { usePartById } from '@/hooks/parts/use-part-by-id'
import { useParams } from 'next/navigation'

const EditPart = () => {
  const params = useParams()
  const vehicleId = params?.vehicleId as string;
  const partId = params?.partId as string;

  const { data: vehicle, isLoading } = usePartById(vehicleId, partId)

  if (isLoading) return <p className='text-center mt-10'>Loading vehicle...</p>
  if (!vehicle) return <p className='text-center mt-10'>Vehicle not found.</p>
  return (
    <div className='w-full flex justify-center flex-col'>
      <PartsForm defaultValues={vehicle}/>
    </div>
  )
}

export default EditPart
