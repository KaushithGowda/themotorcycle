import { ReactNode } from 'react'
import { AppThemeProvider } from '@/providers/app-theme-provider'
import { ReactQueryProvider } from '@/providers/react-query-provider'
import { ToastProvider } from '@/providers/toast-provider'

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryProvider>
      <ToastProvider />
      <AppThemeProvider>{children}</AppThemeProvider>
    </ReactQueryProvider>
  )
}
