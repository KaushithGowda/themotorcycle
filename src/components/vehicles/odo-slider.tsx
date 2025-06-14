'use client'

import { useMemo, useState } from 'react'
import Picker from 'react-mobile-picker'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface OdoSliderProps {
  value: number
  onChange: (value: number) => void
}

const OdoSlider = ({ value, onChange }: OdoSliderProps) => {
  const digitCount = 7
  const [tempValue, setTempValue] = useState(value)
  const [open, setOpen] = useState(false)

  const digits = tempValue.toString().padStart(digitCount, '0').split('')

  const pickerValue = useMemo(() => {
    return digits.reduce((acc, digit, idx) => {
      acc[`d${idx}`] = digit
      return acc
    }, {} as Record<string, string>)
  }, [digits])

  const handleChange = (value: Record<string, string>) => {
    const joined = Object.values(value).join('')
    setTempValue(Number(joined))
  }

  return (
    <div className='space-y-2'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className='w-full'>
          <Button variant='secondary' className='uppercase'>
            {tempValue} kms
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[300px]'>
          <DialogHeader>
            <DialogTitle>Set Odometer</DialogTitle>
          </DialogHeader>
          <div className='bg-gray-100 dark:bg-[#1c1c1c] rounded-md border border-gray-300 dark:border-gray-700 shadow-lg flex px-2 py-2 justify-between mb-4'>
            <div className='flex space-x-1'>
              {digits.map((digit, index) => (
                <div key={index} className='flex items-center space-x-1'>
                  <div className='bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm w-5 h-8 flex items-center justify-center font-mono border border-gray-400 dark:border-gray-700 rounded-sm'>
                    {digit}
                  </div>
                  {(index === 1 || index === 3) && (
                    <div className='text-gray-500 dark:text-gray-400 text-2xl leading-none'>
                      ,
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className='flex flex-col justify-end items-end ml-2'>
              <span className='font-extrabold uppercase text-xs tracking-widest text-gray-700 dark:text-gray-200'>
                kms
              </span>
              <span className='font-extrabold text-xs tracking-widest text-gray-400 dark:text-gray-700'>
                MILES
              </span>
            </div>
          </div>
          <Picker value={pickerValue} onChange={handleChange}>
            {Array.from({ length: digitCount }).map((_, i) => (
              <Picker.Column key={i} name={`d${i}`}>
                {Array.from({ length: 10 }, (_, digit) => (
                  <Picker.Item key={digit} value={digit.toString()}>
                    {digit}
                  </Picker.Item>
                ))}
              </Picker.Column>
            ))}
          </Picker>
          <DialogFooter>
            <Button type='button' onClick={() => { onChange(tempValue); setOpen(false); }}>
              Set
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OdoSlider
