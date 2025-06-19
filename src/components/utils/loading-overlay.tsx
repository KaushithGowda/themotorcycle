'use client'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { ThreeDots } from 'react-loader-spinner'

export function LoadingOverlay() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const isLoading = isFetching > 0 || isMutating > 0

  if (isLoading)
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm'>
        <ThreeDots
          visible={true}
          height='80'
          width='80'
          color={'white'}
          radius='9'
          ariaLabel='three-dots-loading'
          wrapperStyle={{}}
          wrapperClass=''
        />
      </div>
    )
  return null
}
