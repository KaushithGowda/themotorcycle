'use client'
import { Button } from '@/components/ui/button'
import { usePreferenceStore } from '@/store/usePreferenceStore'

const Settings = () => {
  const mode = usePreferenceStore((state) => state.mode)
  const toggle = usePreferenceStore((state) => state.modeChange)
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <Button className='cursor-pointer capitalize' onClick={toggle}>
        {mode}
      </Button>
    </div>
  )
}

export default Settings
