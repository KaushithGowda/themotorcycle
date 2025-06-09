'use client'

import { useGetVehicles } from '@/hooks/use-get-vehicles'
import { Card } from '@/components/ui/card'
import { ImageWithFallback } from '@/components/utils/ImageWithFallback'
import { Separator } from '@/components/ui/separator'
import OdoMeter from '@/components/vehicles/odo-meter'
import RegNumber from './reg-number'

export const VehicleList = () => {
  const { data: vehicles, isLoading, isError } = useGetVehicles()

  if (isError) return <p>Error</p>
  if (isLoading) return <p>Loading...</p>
  return (
    <>
      {vehicles?.map((vehicle) => (
        <Card
          key={vehicle.id}
          className='w-72 py-0 rounded-2xl overflow-hidden shadow-lg border'
        >
          {vehicle.imgUrl || (
            <div className='h-40 w-full relative'>
              <ImageWithFallback
                src={'/uploads/porsche.jpg'}
                alt={vehicle.make}
                fill
                className='object-cover'
              />
            </div>
          )}
          <div className='px-4 pb-4'>
            <span className='font-extrabold text-lg text-primary capitalize'>
              {vehicle.model}
            </span>
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground uppercase text-xs'>
                {vehicle.make}
              </span>
              <Separator
                orientation='vertical'
                className='data-[orientation=vertical]:h-4'
              />
              <span className='text-muted-foreground uppercase text-xs'>
                {vehicle.color}
              </span>
              <Separator
                orientation='vertical'
                className='data-[orientation=vertical]:h-4'
              />
              <span className='text-muted-foreground uppercase text-xs'>
                {vehicle.year}
              </span>
            </div>
            <div className='my-2'>
              <RegNumber />
              {/* <span className='text-muted-foreground uppercase text-xs'>
                {vehicle.regNumber}
                </span> */}
            </div>
            <div className='mt-2'>
              <OdoMeter odoReading={vehicle.odoReading} />
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
