import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const ErrorPage = () => {
  return (
    <div className='flex flex-col gap-6'>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2 min-h-96'>
          <div className='flex flex-col items-center justify-center p-10 space-y-4 text-center'>
            <h2 className='text-xl font-semibold text-destructive'>Something went wrong</h2>
            <p className='text-sm text-muted-foreground'>We couldn’t sign you in. Please try again.</p>
            <a
              href='/auth/login'
              className='text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80'
            >
              Try again
            </a>
          </div>
          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/uploads/car-photo.png'
              alt='Error Image'
              fill
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorPage;