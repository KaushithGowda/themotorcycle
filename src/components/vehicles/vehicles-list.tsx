'use client'

import { useGetVehicles } from '@/hooks/vehicles/use-get-vehicles'
import { Card } from '@/components/ui/card'
import { ImageWithFallback } from '@/components/utils/ImageWithFallback'
import { Separator } from '@/components/ui/separator'
import OdoMeter from '@/components/vehicles/odo-meter'
import RegNumber from './reg-number'
import { Button } from '../ui/button'
import { FaLongArrowAltRight, FaPen } from 'react-icons/fa'
import Link from 'next/link'
import { useToast } from '@/hooks/utils/use-toast'
import { ErrorState } from '../shared/error-state'

export const VehicleList = () => {
  const { data: vehicles, isLoading, isError, error } = useGetVehicles()

  useToast({
    isError,
    errorMsg: error?.message,
    isLoading,
  })

  if (isError || !vehicles)
    return <ErrorState heading={error?.name} message={error?.message} />

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 w-full'>
        <h1 className='text-3xl font-bold'>Welcome to Your Garage</h1>
        <p className='text-muted-foreground text-lg'>
          A place where we look after your vehicles
        </p>
        <p className='text-muted-foreground text-lg'>
          Add your vehicle to get started
        </p>
        <Button asChild>
          <Link href='/vehicles/new'>Add Your Vehicle</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='flex flex-wrap gap-5'>
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle.id}
          className='relative w-72 min-h-[350px] py-0 rounded-2xl overflow-hidden shadow-lg border'
        >
          <Button
            asChild
            variant='secondary'
            size='icon'
            className='absolute top-2 right-2 z-10 p-1 cursor-pointer'
          >
            <Link href={`/vehicles/${vehicle.id}`}>
              <FaPen size={18} />
            </Link>
          </Button>
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
            <div className='flex justify-between items-center'>
              <div>
                <span className='font-extrabold text-lg text-primary capitalize'>
                  {vehicle.model}
                </span>
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground  uppercase text-xs'>
                    {vehicle.make}
                  </span>
                  <Separator
                    orientation='vertical'
                    className='data-[orientation=vertical]:h-4'
                  />
                  <span className='text-muted-foreground uppercase text-xs '>
                    {vehicle.color}
                  </span>
                  <Separator
                    orientation='vertical'
                    className='data-[orientation=vertical]:h-4'
                  />
                  <span className='text-muted-foreground uppercase text-xs '>
                    {vehicle.dateOfReg}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  asChild
                  className='uppercase cursor-pointer'
                  variant={'secondary'}
                >
                  <Link href={`/vehicles/${vehicle.id}/parts`}>
                    go
                    <FaLongArrowAltRight />
                  </Link>
                </Button>
              </div>
            </div>
            <div className='my-2'>
              <RegNumber />
            </div>
            <div className='my-2'>
              <OdoMeter odoReading={vehicle.odoReading} />
            </div>
          </div>
        </Card>
      ))}
      <Button variant={'secondary'} asChild className='h-20 w-20 flex items-center justify-center'>
        <Link href='/vehicles/new' className='font-extrabold text-xl'>+</Link>
      </Button>
    </div>
  )
}
