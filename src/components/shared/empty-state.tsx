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
    <div className='max-w-3xl mx-auto mt-10'>
      <div className='flex w-full gap-4'>
        <Alert>
          <MdOutlineHourglassEmpty />
          <AlertTitle>{heading}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
