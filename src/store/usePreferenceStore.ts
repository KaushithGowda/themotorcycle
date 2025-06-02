import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type theme = 'blue' | 'red' | 'green'

type fontSize = 'sm' | 'md' | 'lg'

type fontFamily = 'inter' | 'mono' | 'serif'

type PreferenceStore = {
  mode: 'light' | 'dark'
  theme: theme
  fontSize: fontSize
  fontFamily: fontFamily
  modeChange: () => void
  themeChange: (val: theme) => void
  fontFamilyChange: (val: fontFamily) => void
  fontSizeChange: (val: fontSize) => void
}

export const usePreferenceStore = create<PreferenceStore>()(
  persist(
    (set) => ({
      mode: 'light',
      theme: 'blue',
      fontSize: 'sm',
      fontFamily: 'inter',
      modeChange: () =>
        set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
      themeChange: (val: theme) => set({ theme: val }),
      fontFamilyChange: (val: fontFamily) => set({ fontFamily: val }),
      fontSizeChange: (val: fontSize) => set({ fontSize: val }),
    }),
    {
      name: 'user-preferences',
    }
  )
)
