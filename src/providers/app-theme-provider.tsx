import { ThemeProvider } from 'next-themes'
import { ThemeSyncer } from '@/components/theme-syncer'

type ProviderProps = { children: React.ReactNode }

export const AppThemeProvider = ({ children }: ProviderProps) => {
  return (
    <ThemeProvider
      attribute='class'
      enableSystem
      defaultTheme='system'
    >
      {children}
      <ThemeSyncer />
    </ThemeProvider>
  )
}
