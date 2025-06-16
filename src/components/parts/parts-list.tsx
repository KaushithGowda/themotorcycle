'use client'

import { useGetParts } from '@/hooks/parts/use-get-parts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaPen } from 'react-icons/fa'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useToast } from '@/hooks/utils/use-toast'
import { ErrorState } from '../shared/error-state'
import Image from 'next/image'
import { Progress } from '@/components/ui/progress'

export const PartsList = () => {
  const { vehicleId } = useParams()
  console.log({ vehicleId })

  const {
    data: parts,
    isLoading,
    isError,
    error,
  } = useGetParts(String(vehicleId ?? ''))

  useToast({
    isError,
    errorMsg: error?.message,
    isLoading,
  })

  return (
    <>
      <div className='flex flex-col'>
        <div className='relative w-full h-60'>
          <Image
            src='/uploads/cover-placeholder.jpg'
            alt='Cover'
            className='w-full h-full object-cover rounded-xl'
            width={112}
            height={112}
          />
          <div className='absolute top-44 left-5 flex flex-col items-center'>
            <Image
              src='/uploads/cover-placeholder.jpg'
              alt='Vehicle'
              width={100}
              height={100}
              className='w-28 h-28 rounded-full border-4 border-background object-cover'
              priority
            />
            <div>
              <h2 className='text-sm font-bold'>Alto</h2>
              <p className='text-muted-foreground font-mono text-xs'>Maruti Suzuki</p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-32'>
        {isError && (
          <ErrorState heading={error?.name} message={error?.message} />
        )}

        {!isError && (!parts || parts.length === 0) && (
          <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 w-full'>
            <h1 className='text-3xl font-bold'>No Parts Added Yet</h1>
            <p className='text-muted-foreground text-lg'>
              Keep track of all parts used on your vehicles
            </p>
            <Button asChild>
              <Link href={`/vehicles/${vehicleId}/parts/new`}>Add Part</Link>
            </Button>
          </div>
        )}

        {!isError && parts && parts.length > 0 && (
          <div className='flex flex-wrap gap-5'>
            {parts.map((part) => {
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
                      src='/uploads/porsche.jpg'
                      alt={part.name}
                      layout='fill'
                      objectFit='cover'
                      className='rounded-t-2xl'
                    />
                    <Button
                      asChild
                      variant='secondary'
                      size='icon'
                      className='absolute top-2 right-2 z-10 p-1 cursor-pointer'
                    >
                      <Link href={`/vehicles/${vehicleId}/parts/${part.id}`}>
                        <FaPen size={16} />
                      </Link>
                    </Button>
                  </div>
                  <div className='px-4 py-2 space-y-2'>
                    <div className='flex flex-col'>
                      <h3 className='font-bold text-lg capitalize'>
                        {part.name || 'Name'}
                      </h3>
                      <span className='text-xs text-muted-foreground font-mono'>
                        {part.partNumber}
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
                        value={(Number(part.startOdo) / Number(part.endOdo)) * 100}
                        className={`h-2 ${ 
                          (Number(part.startOdo) / Number(part.endOdo)) * 100 <= 35
                            ? '[&>div]:bg-destructive'
                            : (Number(part.startOdo) / Number(part.endOdo)) * 100 <= 60
                            ? '[&>div]:bg-yellow-500'
                            : '[&>div]:bg-green-600'
                        }`}
                      />
                      <p className='text-xs text-center text-muted-foreground'>
                        {Number(part.endOdo) - Number(part.startOdo)} kms left
                      </p>
                    </div>

                    {/* <div className='pt-2'>
                      <Button
                        asChild
                        variant='link'
                        className='text-primary p-0 text-xs'
                      >
                        <Link href={`/parts/${part.id}`}>
                          View Details{' '}
                          <FaLongArrowAltRight className='ml-1 inline-block' />
                        </Link>
                      </Button>
                    </div> */}
                  </div>
                </Card>
              )
            })}
            <Button
              variant={'secondary'}
              asChild
              className='h-20 w-20 flex items-center justify-center'
            >
              <Link href='/parts/new' className='font-extrabold text-xl'>
                +
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
