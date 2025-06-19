'use client'

import { useGetParts } from '@/hooks/parts/use-get-parts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useToast } from '@/hooks/utils/use-toast'
import { ErrorState } from '../shared/error-state'
import Image from 'next/image'
import { Progress } from '@/components/ui/progress'
import { Part } from '@/types/part'
import { ImageWithFallback } from '../utils/ImageWithFallback'
import { TiSpanner } from 'react-icons/ti'
import { EmptyState } from '../shared/empty-state'

export const PartsList = () => {
  const { vehicleId } = useParams()

  const {
    data: parts,
    isError,
    error,
  } = useGetParts(typeof vehicleId === 'string' ? vehicleId : '')

  useToast({
    isError,
    errorMsg: error?.message,
  })

  if (!parts && !isError) return <EmptyState heading='Parts not found!' message='Parts data not found' />

  if (isError)
    return <ErrorState heading={error?.name} message={error?.message} />

  return (
    <>
      <div className='relative w-full h-70'>
        <div className='relative overflow-hidden w-full h-60 rounded-xl'>
          <ImageWithFallback
            src={
              (parts && parts[0]?.vehicle?.coverImage) ??
              '/uploads/motorcycle-cover-photo.png'
            }
            priority
            alt='cover'
            fill
            className='object-cover border-2 rounded-xl w-full max-h-full max-w-full'
          />
        </div>
        <div className='absolute left-5 top-[60%] cursor-pointer flex justify-center items-center'>
          <div className='flex flex-col gap-2'>
            <Image
              src={
                (parts && parts[0]?.vehicle?.image) ??
                '/uploads/motorcycle-photo.png'
              }
              alt='Vehicle'
              width={100}
              height={100}
              priority
              className='w-28 h-28 rounded-full object-cover bg-white dark:bg-black border-2'
            />
            <div>
              <h2 className='text-sm font-bold'>Alto</h2>
              <p className='text-muted-foreground font-mono text-xs'>
                Maruti Suzuki
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-24'>
        {!parts ||
          (parts.length === 0 && (
            <div className='flex flex-col items-center justify-center min-h-fit text-center space-y-6 w-full'>
              <h1 className='text-3xl font-bold'>No Parts Added Yet</h1>
              <p className='text-muted-foreground text-lg'>
                Keep track of all parts used on your vehicles
              </p>
              <Button asChild>
                <Link href={`/vehicles/${vehicleId}/parts/new`}>Add Part</Link>
              </Button>
            </div>
          ))}

        {parts && parts.length > 0 && (
          <div className='flex flex-wrap gap-5'>
            {parts.map((part: Part) => {

              const startDate = new Date(part.startDate)
              const endDate = new Date(part.endDate)
              const today = new Date()

              const totalDays = Math.ceil(
                (endDate.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
              const elapsedDays = Math.ceil(
                (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
              )

              const durationProgress =
                totalDays > 0
                  ? Math.min((elapsedDays / totalDays) * 100, 100)
                  : 0

              return (
                <Card
                  key={part.id}
                  className='relative py-0 gap-1 w-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'
                >
                  <div className='relative h-36 bg-muted'>
                    <Image
                      src={part?.image ?? '/uploads/car-photo.png'}
                      alt={part?.partName || 'part-image'}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      priority={false}
                      className='rounded-t-2xl object-cover'
                    />
                    <Button
                      asChild
                      variant='secondary'
                      className='absolute top-2 right-2 z-10 cursor-pointer'
                    >
                      <Link href={`/vehicles/${vehicleId}/parts/${part.id}`}>
                        <TiSpanner/>
                      </Link>
                    </Button>
                  </div>
                  <div className='px-4 py-2 space-y-2'>
                    <div className='flex flex-col'>
                      <h3 className='font-bold text-lg capitalize'>
                        {part.partName || 'Name'}
                      </h3>
                      <span className='text-xs text-muted-foreground font-mono'>
                        {part?.partNumber}
                      </span>
                    </div>

                    <div>
                      <p className='text-xs font-semibold'>Usage Duration</p>
                      <p className='text-xs text-muted-foreground'>
                        {part.startDate} → {part.endDate}
                      </p>
                      <Progress
                        value={durationProgress}
                        className={`h-2 ${
                          durationProgress <= 35
                            ? '[&>div]:bg-destructive'
                            : durationProgress <= 60
                            ? '[&>div]:bg-yellow-500'
                            : '[&>div]:bg-green-600'
                        }`}
                      />
                      <p className='text-xs text-center text-muted-foreground'>
                        {Math.max(totalDays - elapsedDays, 0)} days left
                      </p>
                    </div>

                    <div>
                      <p className='text-xs font-semibold'>Odometer Usage</p>
                      <p className='text-xs text-muted-foreground'>
                        {part.startOdo} → {part.endOdo}
                      </p>
                      <Progress
                        value={
                          (Number(part.startOdo) / Number(part.endOdo)) * 100
                        }
                        className={`h-2 ${
                          (Number(part.startOdo) / Number(part.endOdo)) * 100 <=
                          35
                            ? '[&>div]:bg-destructive'
                            : (Number(part.startOdo) / Number(part.endOdo)) *
                                100 <=
                              60
                            ? '[&>div]:bg-yellow-500'
                            : '[&>div]:bg-green-600'
                        }`}
                      />
                      <p className='text-xs text-center text-muted-foreground'>
                        {Number(part.endOdo) - Number(part.startOdo)} kms left
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
            <Button
              variant={'secondary'}
              asChild
              className='h-20 w-20 flex items-center justify-center'
            >
              <Link href={`/vehicles/${vehicleId}/parts/new`} className='font-extrabold text-xs'>  
                + Add Part
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
