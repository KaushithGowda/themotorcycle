'use client'

const COLOR_OPTIONS = [
  { value: 'black', bg: 'bg-black' },
  { value: 'white', bg: 'bg-white' },
  { value: 'gray', bg: 'bg-gray-500' },
  { value: 'silver', bg: 'bg-gray-300' },
  { value: 'red', bg: 'bg-red-600' },
  { value: 'blue', bg: 'bg-blue-600' },
  { value: 'green', bg: 'bg-green-600' },
  { value: 'yellow', bg: 'bg-yellow-400' },
  { value: 'orange', bg: 'bg-orange-500' },
  { value: 'brown', bg: 'bg-yellow-800' },
  { value: 'purple', bg: 'bg-purple-600' },
  { value: 'pink', bg: 'bg-pink-500' },
  { value: 'gold', bg: 'bg-yellow-300' },
]

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
import { useRouter } from 'next/navigation'
import { showToast } from '@/lib/utils/toast'
import { useToast } from '@/hooks/utils/use-toast'

const VehicleForm = ({
  defaultValues,
}: {
  defaultValues?: Partial<z.infer<typeof VehicleSchema>> & { id?: string }
}) => {
  const route = useRouter()

  const {
    upload,
    isError: isFileUploadError,
    error: fileUploadError,
    isLoading: isUploadPending,
  } = useFileUpload()

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(
    null
  )

  const form = useForm<z.infer<typeof VehicleSchema>>({
    mode: 'onChange',
    resolver: zodResolver(VehicleSchema),
    defaultValues: defaultValues ?? {
      make: '',
      model: '',
      color: '',
      dateOfReg: '',
      odoReading: '',
      regNumber: '',
      image: '',
      coverImage: '',
      cubicCapacity: '',
      horsePower: '',
      torque: '',
      kerbWeight: '',
    },
  })

  const createMutation = useCreateVehicle({
    onSuccess: () => {
      showToast.success('Vehicle Added!')
      route.push('/vehicles')
      form.reset()
      setSelectedImage(null)
    },
    onError: (err: unknown): void => {
      showToast.error('Failed to add Vehicle!')
      console.error('Failed to add profile:', err)
    },
  })

  const updateMutation = useUpdateVehicle({
    onSuccess: () => {
      showToast.success('Vehicle updated!')
      route.push('/vehicles')
    },
    onError: (err: unknown): void => {
      showToast.error('Failed to update Vehicle!')
      console.error('Failed to update profile:', err)
    },
  })

  const { isError: isMutationError, error: mutationError } = updateMutation

  const onSubmit = async (values: z.infer<typeof VehicleSchema>) => {
    let image = defaultValues?.image ?? ''
    if (selectedImage) {
      const publicId = defaultValues?.id ?? Date.now().toString()
      const uploaded = await upload({
        file: selectedImage,
        type: 'vehicles',
        publicId,
      })
      image = uploaded ?? ''
    }
    let coverImage = defaultValues?.coverImage ?? ''
    if (selectedCoverImage) {
      const publicId = defaultValues?.id
        ? `${defaultValues.id}_cover`
        : `${Date.now()}_cover`
      const uploaded = await upload({
        file: selectedCoverImage,
        type: 'vehicles',
        publicId,
      })
      coverImage = uploaded ?? ''
    }
    const updatedValues = {
      ...values,
      image,
      coverImage,
    }
    if (defaultValues?.id) {
      updateMutation.mutate({ vehicleId: defaultValues.id, ...updatedValues })
    } else {
      createMutation.mutate(updatedValues)
    }
  }

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  const isPending =
    createMutation.isPending || updateMutation.isPending || isUploadPending

  useToast({
    isError: isMutationError,
    errorMsg: mutationError?.message,
  })

  useToast({
    isError: isFileUploadError,
    errorMsg: fileUploadError?.message,
  })

  return (
    <>
      <div className='relative'>
        <label
          htmlFor='cover-image'
          className='cursor-pointer flex justify-center'
        >
          <div className='relative w-full h-50 rounded-xl overflow-hidden'>
            {selectedCoverImage ? (
              <Image
                src={URL.createObjectURL(selectedCoverImage)}
                alt='cover preview'
                fill
                className='object-cover'
                style={{ objectFit: 'cover' }}
                sizes='100vw'
                priority
              />
            ) : (
              <ImageWithFallback
                src={
                  defaultValues?.coverImage ?? '/uploads/cover-placeholder.jpg'
                }
                alt='cover'
                fill
                className='object-cover'
              />
            )}
          </div>
          <input
            id='cover-image'
            type='file'
            accept='image/*'
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedCoverImage(e.target.files[0])
              }
            }}
            className='hidden'
          />
        </label>
        <div>
          <label
            htmlFor='vehicle-image'
            className='absolute left-5 top-[60%] cursor-pointer flex justify-center'
          >
            <div className='relative'>
              <Card className='h-40 w-40 rounded-full overflow-hidden shadow-lg ring-2 ring-zinc-200 dark:ring-zinc-700 relative'>
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
                    src={defaultValues?.image ?? '/uploads/image-not-found.png'}
                    alt='vehicle'
                    fill
                    className='object-cover'
                  />
                )}
              </Card>
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
      </div>
      <div className='mt-24 max-w-5xl'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-5'>
              <FormField
                key='odoReading'
                control={form.control}
                name='odoReading'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='capitalize'>{field.name}</FormLabel>
                    <FormControl>
                      <OdoSlider
                        value={field.value}
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
                  'kerbWeight',
                ] as const
              ).map((fieldName) => (
                <div key={fieldName}>
                  <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className='capitalize'>
                          {fieldName === 'dateOfReg'
                            ? 'Date of Registration'
                            : fieldName === 'regNumber'
                            ? 'Registration Number'
                            : fieldName === 'cubicCapacity'
                            ? 'Cubic Capacity'
                            : fieldName === 'horsePower'
                            ? 'Horse Power'
                            : fieldName === 'kerbWeight'
                            ? 'Kerb Weight'
                            : fieldName === 'make'
                            ? 'Make'
                            : fieldName === 'model'
                            ? 'Model'
                            : fieldName === 'torque'
                            ? 'Torque'
                            : 'Color'}
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
                                {COLOR_OPTIONS.map(({ value, bg }) => (
                                  <SelectItem key={value} value={value}>
                                    <div className='flex items-center gap-2'>
                                      <span className={`w-4 h-4 rounded-full border ${bg}`} />
                                      {value.charAt(0).toUpperCase() + value.slice(1)}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        ) : fieldName === 'dateOfReg' ? (
                          <FormControl>
                            <Input
                              type='date'
                              placeholder='Registration date'
                              value={field.value ?? ''}
                              onChange={field.onChange}
                              disabled={isPending}
                              className={'uppercase'}
                            />
                          </FormControl>
                        ) : [
                            'cubicCapacity',
                            'kerbWeight',
                            'torque',
                            'horsePower',
                          ].includes(fieldName) ? (
                          <FormControl>
                            <Input
                              placeholder={
                                fieldName === 'cubicCapacity'
                                  ? 'cc'
                                  : fieldName === 'kerbWeight'
                                  ? 'kerb weight'
                                  : fieldName === 'torque'
                                  ? 'torque'
                                  : 'hp'
                              }
                              {...field}
                              value={field.value ?? ''}
                              disabled={isPending}
                              type='number'
                              className='uppercase'
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
                              value={field.value ?? ''}
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
    </>
  )
}

export default VehicleForm
