import { ThemeProvider } from 'next-themes'
import { ThemeSyncer } from '@/components/theme-syncer'

type ProviderProps = { children: React.ReactNode }

export const Providers = ({ children }: ProviderProps) => {
  return (
    <ThemeProvider
      attribute='class'
      enableSystem
      disableTransitionOnChange
      defaultTheme='system'
    >
      {children}
      <ThemeSyncer />
    </ThemeProvider>
  )
}
