'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FaExclamationTriangle } from 'react-icons/fa'

type ErrorType = {
  heading?: string
  message?: string
}

export const ErrorState = ({ heading, message }: ErrorType) => {
  return (
    <div className='max-w-xl mx-auto mt-10'>
      <Alert variant='destructive'>
        <FaExclamationTriangle />
        <AlertTitle>{heading || 'Something went wrong!'}</AlertTitle>
        <AlertDescription>
          {message || 'Please try again later.'}
        </AlertDescription>
      </Alert>
    </div>
  )
}
