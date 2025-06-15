'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center text-center space-y-4'>
      <span className='text-4xl font-bold text-destructive'>
        Something went wrong!
      </span>
      <span className='text-muted-foreground'>{error.message}</span>
      <Button onClick={() => reset()} variant={'default'}>
        Try again
      </Button>
    </div>
  )
}
