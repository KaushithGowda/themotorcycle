'use client'

import { useFileUpload } from '@/hooks/fileUpload/use-file-upload'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { VehicleSchema } from '@/schemas'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateVehicle } from '@/hooks/vehicles/use-create-vehicle'
import { useUpdateVehicle } from '@/hooks/vehicles/use-update-vehicle'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Card } from '../ui/card'
import { ImageWithFallback } from '../utils/ImageWithFallback'
import Image from 'next/image'
import OdoSlider from '@/components/vehicles/odo-slider'
import { FaPen } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const VehicleForm = ({
  defaultValues,
}: {
  defaultValues?: Partial<z.infer<typeof VehicleSchema>> & { id?: string }
}) => {
  const route = useRouter()

  const { upload } = useFileUpload()

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const form = useForm<z.infer<typeof VehicleSchema>>({
    mode: 'onChange',
    resolver: zodResolver(VehicleSchema),
    defaultValues: defaultValues ?? {
      make: '',
      model: '',
      color: '',
      dateOfReg: '',
      odoReading: 0,
      regNumber: '',
      imgUrl: '',
      cubicCapacity: '',
      horsePower: '',
      torque: '',
    },
  })

  const createMutation = useCreateVehicle({
    onSuccess: () => {
      setSuccess('Vehicle created successfully')
      setError('')
      form.reset()
      setSelectedImage(null)
    },
    onError: (err: Error) => {
      setError(err.message)
      setSuccess('')
    },
  })

  const updateMutation = useUpdateVehicle({
    onSuccess: () => {
      setSuccess('Vehicle updated successfully')
      setError('')
      route.push('/vehicles')
    },
    onError: (err: Error) => {
      setError(err.message)
      setSuccess('')
    },
  })

  const onSubmit = async (values: z.infer<typeof VehicleSchema>) => {
    let imgUrl = defaultValues?.imgUrl ?? ''

    if (selectedImage) {
      const publicId = defaultValues?.id ?? Date.now().toString()
      const type = 'vehicles'
      const uploaded = await upload(selectedImage, type, publicId)
      imgUrl = uploaded ?? ''
    }

    const payload = {
      ...values,
      imgUrl,
    }

    if (defaultValues?.id) {
      updateMutation.mutate({ vehicleId: defaultValues.id, ...payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  const isPending =
    createMutation.isPending || updateMutation.isPending

  return (
    <div className='p-6 max-w-6xl'>
      <div className='flex flex-col md:flex-row md:items-start md:justify-start items-center justify-center mb-8'>
        <label
          htmlFor='vehicle-image'
          className='cursor-pointer flex justify-center'
        >
          <div className='relative'>
            <Card className='h-60 w-60 rounded-xl overflow-hidden shadow-lg ring-2 ring-zinc-200 dark:ring-zinc-700 relative'>
              {selectedImage ? (
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt='preview'
                  fill
                  className='object-cover'
                  style={{ objectFit: 'cover' }}
                  sizes='240px'
                  priority
                />
              ) : (
                <ImageWithFallback
                  src={defaultValues?.imgUrl ?? '/fallback.png'}
                  alt='vehicle'
                  fill
                  className='object-cover'
                />
              )}
            </Card>
            <div className='absolute top-2 right-2 bg-black/60 text-white p-2 rounded-lg'>
              <FaPen size={18} />
            </div>
          </div>
          <input
            id='vehicle-image'
            type='file'
            accept='image/*'
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedImage(e.target.files[0])
              }
            }}
            className='hidden'
          />
        </label>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-wrap gap-2'>
            <div className='w-full md:w-[calc(50%-0.5rem)]'>
              <FormField
                key='odoReading'
                control={form.control}
                name='odoReading'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='capitalize'>{field.name}</FormLabel>
                    <FormControl>
                      <OdoSlider
                        value={Number(field.value)}
                        onChange={(val) =>
                          form.setValue('odoReading', val, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {(
              [
                'make',
                'model',
                'color',
                'dateOfReg',
                'regNumber',
                'cubicCapacity',
                'horsePower',
                'torque',
              ] as const
            ).map((fieldName) => (
              <div className='w-full md:w-[calc(50%-0.5rem)]' key={fieldName}>
                <FormField
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='capitalize'>
                        {fieldName === 'dateOfReg'
                          ? 'Date of Registration'
                          : fieldName === 'regNumber'
                          ? 'Registration Number'
                          : fieldName}
                      </FormLabel>
                      {fieldName === 'color' ? (
                        <FormControl>
                          <Select
                            name={field.name}
                            onValueChange={field.onChange}
                            value={
                              field.value ? String(field.value) : undefined
                            }
                            defaultValue={
                              field.value ? String(field.value) : undefined
                            }
                          >
                            <SelectTrigger
                              name={field.name}
                              aria-invalid={!!form.formState.errors?.color}
                              className='w-full'
                            >
                              <SelectValue placeholder='Select a color' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='black'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-black border' />
                                  Black
                                </div>
                              </SelectItem>
                              <SelectItem value='white'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-white border' />
                                  White
                                </div>
                              </SelectItem>
                              <SelectItem value='gray'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-gray-500 border' />
                                  Gray
                                </div>
                              </SelectItem>
                              <SelectItem value='silver'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-gray-300 border' />
                                  Silver
                                </div>
                              </SelectItem>
                              <SelectItem value='red'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-red-600 border' />
                                  Red
                                </div>
                              </SelectItem>
                              <SelectItem value='blue'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-blue-600 border' />
                                  Blue
                                </div>
                              </SelectItem>
                              <SelectItem value='green'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-green-600 border' />
                                  Green
                                </div>
                              </SelectItem>
                              <SelectItem value='yellow'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-yellow-400 border' />
                                  Yellow
                                </div>
                              </SelectItem>
                              <SelectItem value='orange'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-orange-500 border' />
                                  Orange
                                </div>
                              </SelectItem>
                              <SelectItem value='brown'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-yellow-800 border' />
                                  Brown
                                </div>
                              </SelectItem>
                              <SelectItem value='purple'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-purple-600 border' />
                                  Purple
                                </div>
                              </SelectItem>
                              <SelectItem value='pink'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-pink-500 border' />
                                  Pink
                                </div>
                              </SelectItem>
                              <SelectItem value='gold'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full bg-yellow-300 border' />
                                  Gold
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      ) : fieldName === 'dateOfReg' ? (
                        <FormControl>
                          <Input
                            type='date'
                            placeholder='Registration date'
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isPending}
                            className={'uppercase'}
                          />
                        </FormControl>
                      ) : (
                        <FormControl>
                          <Input
                            placeholder={
                              fieldName === 'regNumber'
                                ? 'Registration Number'
                                : fieldName
                            }
                            {...field}
                            disabled={isPending}
                            type='text'
                            className='uppercase'
                          />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
          <div className='space-y-3 mt-4'>
            {error && (
              <p className='text-sm text-red-500 font-medium'>{error}</p>
            )}
            {success && (
              <p className='text-sm text-green-600 font-medium'>{success}</p>
            )}
            <div className='flex'>
              <Button
                type='submit'
                className='font-bold py-2 text-sm cursor-pointer'
                disabled={isPending}
              >
                {isPending
                  ? defaultValues?.id
                    ? 'Updating...'
                    : 'Adding...'
                  : defaultValues?.id
                  ? 'Update Vehicle'
                  : 'Add Vehicle'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default VehicleForm
