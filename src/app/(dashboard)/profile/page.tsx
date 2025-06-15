'use client'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
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

const Profile = () => {
  const mode = usePreferenceStore((state) => state.mode)
  const toggle = usePreferenceStore((state) => state.modeChange)
  const { data: user, isLoading, isError, error } = useGetProfile()

  useToast({
    isError,
    errorMsg: error?.message,
    isLoading,
  })

  if (isError || !user)
    return <ErrorState heading={error?.name} message={error?.message} />

  return (
    <>
      <div className='mx-auto py-10 space-y-10 px-4 sm:px-0 max-w-7xl'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-4'>
              <ImageWithFallback
                src={user?.imgUrl || '/uploads/user-avatar.jpg'}
                alt='Profile Picture'
                width={48}
                height={48}
                className='rounded-full object-cover border'
              />
              <div>
                <span className='text-lg font-bold leading-tight capitalize'>
                  {user?.name}
                </span>
                <span className='text-muted-foreground text-sm mt-1 block'>
                  {user?.email}
                </span>
              </div>
            </div>
            <div className='mt-2'>
              <Button asChild variant='secondary' size='sm' className='text-sm'>
                <a href='/profile/update-profile'>Edit Profile</a>
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
            <span className='text-sm md:text-md font-medium text-muted-foreground'>
              Phone Number
            </span>
            <span className='text-sm md:text-md text-right font-semibold'>
              +91 98765 43210
            </span>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-sm md:text-md font-medium text-muted-foreground'>
              Driving Experience
            </span>
            <span className='text-sm md:text-md text-right font-semibold'>
              5 years
            </span>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-sm md:text-md font-medium text-muted-foreground'>
              Riding Experience
            </span>
            <span className='text-sm md:text-md text-right font-semibold'>
              8 years
            </span>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-sm md:text-md font-medium text-muted-foreground'>
              My Trips
            </span>
            <span className='text-sm md:text-md text-right font-semibold'>
              12 trips
            </span>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-sm font-medium text-muted-foreground'>
              My Vehicles
            </span>
            <span className='text-sm text-right font-semibold'>3 vehicles</span>
          </div>
          <div className='flex justify-between items-center border-b pb-4'>
            <span className='text-sm font-medium text-muted-foreground'>
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
        </div>

        <div className='mt-20 flex flex-col justify-center items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Version 1.0.0</span>
          <span className='text-sm text-muted-foreground'>
            Built with Next.js, Tailwind CSS, Prisma, and NextAuth.js
          </span>
        </div>
      </div>
    </>
  )
}

export default Profile
