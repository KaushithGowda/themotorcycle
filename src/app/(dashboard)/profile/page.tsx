'use client'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { MdDarkMode, MdLightMode, MdVerified } from 'react-icons/md'
import { usePreferenceStore } from '@/store/usePreferenceStore'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { ImageWithFallback } from '@/components/utils/ImageWithFallback'
import { useGetProfile } from '@/hooks/profile/use-get-profile'
import { useToast } from '@/hooks/utils/use-toast'
import { ErrorState } from '@/components/shared/error-state'
import Link from 'next/link'
import { EmptyState } from '@/components/shared/empty-state'

const Profile = () => {
  const mode = usePreferenceStore((state) => state.mode)
  const toggle = usePreferenceStore((state) => state.modeChange)
  const { data: user, isError, error } = useGetProfile()

  const joinedSince =
    new Date(user?.createdAt).toLocaleString('en-US', { month: 'short' }) +
    ' ' +
    new Date(user?.createdAt)?.getFullYear()

  const calculateExperience = (startDate: string | Date | undefined) => {
    if (!startDate) return { years: 0, months: 0 }

    const start = new Date(startDate)
    const now = new Date()

    let years = now.getFullYear() - start.getFullYear()
    let months = now.getMonth() - start.getMonth()

    if (months < 0) {
      years -= 1
      months += 12
    }

    return { years, months }
  }

  const { years: drivingYears, months: drivingMonths } = calculateExperience(user?.dexp)
  const { years: ridingYears, months: ridingMonths } = calculateExperience(user?.rexp)

  useToast({
    isError,
    errorMsg: error?.message,
  })

  if (!user && !isError) return <EmptyState heading='Data not found!' message='User data not found' />

  if (isError)
    return <ErrorState heading={error?.name} message={error?.message} />

  return (
    <>
      <div className='mx-auto py-2 sm:py-10 space-y-5 sm:space-y-10 px-4 sm:px-0 max-w-7xl'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-4'>
              <ImageWithFallback
                src={user?.image || '/uploads/user-not-found.png'}
                alt='Profile Picture'
                width={60}
                height={60}
                className='rounded-full border aspect-square object-cover'
              />
              <div>
                <span className='text-sm sm:text-lg font-bold leading-tight capitalize'>
                  {user?.name || 'username'}
                </span>
                <span className='text-muted-foreground sm:text-sm text-xs mt-1 flex gap-1 items-center justify-center'>
                  {user?.email || 'email'}{' '}
                  {!user?.emailVerified && (
                    <MdVerified className='text-blue-500' />
                  )}
                </span>
              </div>
            </div>
            <div>
              <Button
                asChild
                variant='secondary'
                size='sm'
                className='sm:text-sm text-xs'
              >
                <Link href='/profile/update-profile'>Edit Profile</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className='space-y-6 mt-6'>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-sm md:text-md font-medium text-muted-foreground'>
              Theme
            </span>
            <Button
              variant='secondary'
              className='cursor-pointer'
              onClick={toggle}
            >
              Switch to {mode === 'light' ? 'Dark' : 'Light'}{' '}
              {mode === 'light' ? <MdDarkMode /> : <MdLightMode />}
            </Button>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-xs sm:text-sm md:text-md font-medium text-muted-foreground'>
              Phone Number
            </span>
            <span className='text-xs sm:text-sm md:text-md text-right font-semibold'>
              +xx xxxxx xxxxx
            </span>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-xs sm:text-sm md:text-md font-medium text-muted-foreground'>
              Driving Experience
            </span>
            <span className='text-xs sm:text-sm md:text-md text-right font-semibold'>
              {drivingYears || drivingMonths ? `${drivingYears}y ${drivingMonths}m` : '-'}
            </span>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-xs sm:text-sm md:text-md font-medium text-muted-foreground'>
              Riding Experience
            </span>
            <span className='text-xs sm:text-sm md:text-md text-right font-semibold'>
              {ridingYears || ridingMonths ? `${ridingYears}y ${ridingMonths}m` : '-'}
            </span>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-xs sm:text-sm md:text-md font-medium text-muted-foreground'>
              Trips
            </span>
            <span className='text-xs sm:text-sm md:text-md text-right font-semibold'>
              -
            </span>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-xs sm:text-sm font-medium text-muted-foreground'>
              My Vehicles
            </span>
            <span className='text-xs sm:text-sm text-right font-semibold'>
              {user?.vehicles.length || 0}{' '}
              {user?.vehicles.length === 1 ? 'vehicle' : 'vehicles'}
            </span>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-xs sm:text-sm font-medium text-muted-foreground'>
              Sign Out
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive' className='cursor-pointer'>
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to logout?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className='cursor-pointer'>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className='cursor-pointer'
                    onClick={() => signOut()}
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {joinedSince && (
            <div className='flex justify-center items-center pt-4'>
              <span className='text-xs sm:text-sm font-bold text-muted-foreground'>
                Joined {joinedSince || 'MM YYYY'}
              </span>
            </div>
          )}
        </div>

        <div className='mt-20 flex flex-col justify-center items-center gap-2'>
          <span className='text-xs sm:text-sm text-muted-foreground'>
            Version 1.0.0
          </span>
          <span className='text-xs sm:text-sm text-muted-foreground text-center'>
            Built with Next.js, Tailwind CSS, Prisma, and NextAuth.js
          </span>
        </div>
      </div>
    </>
  )
}

export default Profile
