'use client'

import { useGetVehicles } from '@/hooks/vehicles/use-get-vehicles'
import { Card } from '@/components/ui/card'
import { ImageWithFallback } from '@/components/utils/ImageWithFallback'
import { Separator } from '@/components/ui/separator'
import OdoMeter from '@/components/vehicles/odo-meter'
import RegNumber from './reg-number'
import { Button } from '../ui/button'
import { FaCarSide, FaMotorcycle } from 'react-icons/fa'
import Link from 'next/link'
import { useToast } from '@/hooks/utils/use-toast'
import { ErrorState } from '../shared/error-state'
import { TiSpanner } from 'react-icons/ti'
import { ColorBadge } from './color-badge'
import { Vehicle } from '@/types/vehicle'
import { MdHealthAndSafety } from 'react-icons/md'
import { EmptyState } from '../shared/empty-state'

export const VehicleList = () => {
  const { data: vehicles, isError, error } = useGetVehicles()

  useToast({
    isError,
    errorMsg: error?.message,
  })

  if (!vehicles && !isError)
    return (
      <EmptyState heading='Vehicles not found!' message='Vehicles data not found' />
    )

  if (isError)
    return <ErrorState heading={error?.name} message={error?.message} />

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 w-full'>
        <h1 className='text-3xl font-bold'>Welcome to Garage</h1>
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
    <div className='flex flex-wrap justify-center sm:justify-start gap-5'>
      {vehicles?.map((vehicle: Vehicle,index: number) => {
        return (
          <Card
            key={vehicle.id}
            className='relative w-72 min-h-[350px] py-0 rounded-2xl overflow-hidden shadow-lg border'
          >
            <Button
              asChild
              variant='secondary'
              className='absolute top-2 right-2 z-10 cursor-pointer'
            >
              <Link href={`/vehicles/${vehicle.id}`}>
                <TiSpanner size={50} />
              </Link>
            </Button>
            <div className='h-40 w-full relative'>
              <ImageWithFallback
                src={vehicle?.image || '/uploads/car-photo.jpg'}
                alt={`${vehicle.make} ${vehicle.model}` || 'Vehicle Image'}
                fill
                sizes='100'
                priority={index === 0}
                className='object-cover'
              />
            </div>
            <div className='px-4 pb-4'>
              <div className='flex justify-between items-center'>
                <div>
                  <span className='font-extrabold text-lg text-primary capitalize'>
                    {vehicle.model}
                  </span>
                  <div className='flex items-center gap-1'>
                    <span className='text-muted-foreground uppercase text-xs'>
                      {vehicle.make.length > 12
                        ? `${vehicle.make.slice(0, 9)}...`
                        : vehicle.make}
                    </span>
                    <Separator
                      orientation='vertical'
                      className='data-[orientation=vertical]:h-4'
                    />
                    <span className='text-muted-foreground uppercase text-xs '>
                      <ColorBadge color={vehicle?.color} />
                    </span>
                    <Separator
                      orientation='vertical'
                      className='data-[orientation=vertical]:h-4'
                    />
                    <span className='text-muted-foreground uppercase text-xs '>
                      {(() => {
                        const regDate = new Date(vehicle.dateOfReg)
                        const now = new Date()
                        const diffInMs = now.getTime() - regDate.getTime()
                        const diffInMonths =
                          diffInMs / (1000 * 60 * 60 * 24 * 30.44)
                        const years = Math.floor(diffInMonths / 12)
                        return years >= 1
                          ? `${years} yr${years > 1 ? 's' : ''}`
                          : ''
                      })()}
                    </span>
                  </div>
                </div>
                <Button
                  asChild
                  className='uppercase cursor-pointer'
                  variant={'secondary'}
                >
                  <Link className='' href={`/vehicles/${vehicle.id}/parts`}>
                    Check
                    <MdHealthAndSafety color='red' />
                  </Link>
                </Button>
              </div>
              <div className='my-2'>
                <RegNumber />
              </div>
              <div className='my-2'>
                <OdoMeter odoReading={vehicle.odoReading} />
              </div>
            </div>
          </Card>
        )
      })}
      <Button variant={'secondary'} asChild className='sm:py-10'>
        <Link href='/vehicles/new' className='font-extrabold'>
          + Add <FaMotorcycle /> / <FaCarSide />
        </Link>
      </Button>
    </div>
  )
}
