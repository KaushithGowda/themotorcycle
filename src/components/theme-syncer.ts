'use client'

import { usePreferenceStore } from '@/store/usePreferenceStore'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function ThemeSyncer() {
  const { setTheme } = useTheme()
  const mode = usePreferenceStore((state) => state.mode)

  useEffect(() => {
    setTheme(mode)
  }, [mode, setTheme])

  return null
}
