'use client'
import { Button } from '@/components/ui/button'
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card } from '@/components/ui/card'
import { ImageWithFallback } from '@/components/utils/ImageWithFallback'

const Settings = () => {
  const mode = usePreferenceStore((state) => state.mode)
  const toggle = usePreferenceStore((state) => state.modeChange)
  return (
    <div className='mx-auto py-10 space-y-10 px-4 sm:px-0 max-w-7xl'>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-4'>
            <ImageWithFallback
              src='/uploads/user-avatar.jpg'
              alt='Profile Picture'
              width={48}
              height={48}
              className='rounded-full object-cover border'
            />
            <div>
              <span className='text-2xl font-semibold leading-tight'>
                John Doe
              </span>
              <p className='text-muted-foreground text-sm mt-1'>
                johndoe@example.com
              </p>
            </div>
          </div>
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
                <AlertDialogAction className='cursor-pointer'>
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-lg font-medium'>Theme</span>
          <Button variant='outline' className='cursor-pointer' onClick={toggle}>
            Switch to {mode === 'light' ? 'Dark' : 'Light'}{' '}
            {mode === 'light' ? <MdDarkMode /> : <MdLightMode />}
          </Button>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-lg font-medium'>My Vehicles</span>
        </div>
        <Carousel
          opts={{
            align: 'start',
          }}
          className='w-full max-w-2xl mx-auto'
        >
          <CarouselContent>
            {[...Array(3)].map((_, index) => (
              <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/2'>
                <div className='p-1'>
                  <Card className='overflow-hidden py-0'>
                    <div className='relative w-full h-40'>
                      <ImageWithFallback
                        src='/uploads/porsche.jpg'
                        alt='Vehicle'
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='p-2 text-center'>
                      <span className='text-sm font-medium'>Porsche 911</span>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default Settings
