import toast from 'react-hot-toast'

type ToastMsg = {
  loading: string
  error: string
  success: string
}

export const showToast = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  loading: (msg: string) => toast.loading(msg),
  promise: <T>(promise: Promise<T>, msg: ToastMsg) =>
    toast.promise(promise, {
      loading: msg.loading,
      success: msg.success,
      error: msg.error,
    }),
}
