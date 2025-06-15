import { useEffect } from 'react'
import toast from 'react-hot-toast'

type toastType = {
  isError?: boolean
  isSuccess?: boolean
  isLoading?: boolean
  errorMsg?: string
  successMsg?: string
  loadingMsg?: string
}

export function useToast({
  isError,
  isSuccess,
  isLoading,
  errorMsg,
  successMsg,
  loadingMsg,
}: toastType) {
  useEffect(() => {
    if (isError) toast.error(errorMsg || 'Something went wrong!')
    else if (isSuccess) toast.success(successMsg || 'Success!')
    else if (isLoading) toast.loading(loadingMsg || 'Loading...')
  }, [isError, isSuccess, isLoading, errorMsg, successMsg, loadingMsg])
}
