'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MdOutlineHourglassEmpty } from 'react-icons/md'

type EmptyStateProps = {
  heading?: string
  message?: string
}

export const EmptyState = ({
  heading = 'Nothing to display',
  message = 'There is no data available at the moment.',
}: EmptyStateProps) => {
  return (
    <div className='max-w-xl mx-auto mt-10'>
      <Alert>
        <div className='flex items-start gap-2'>
          <MdOutlineHourglassEmpty className='mt-1 h-5 w-5 text-muted-foreground' />
          <div>
            <AlertTitle>{heading}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  )
}