'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { ImageWithFallback } from '@/components/utils/ImageWithFallback'
import { PartSchema } from '@/schemas'
import OdoSlider from '@/components/vehicles/odo-slider'
import { useCreatePart } from '@/hooks/parts/use-create-part'
import { useUpdatePart } from '@/hooks/parts/use-update-part'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { showToast } from '@/lib/utils/toast'
import { useFileUpload } from '@/hooks/fileUpload/use-file-upload'
import { useToast } from '@/hooks/utils/use-toast'
import { TiSpanner } from 'react-icons/ti'

const FIELD_LABELS: Record<string, string> = {
  partName: 'Part Name',
  partNumber: 'Part Number',
  startOdo: 'Start Odo',
  endOdo: 'End Odo',
  startDate: 'Start Date',
  endDate: 'End Date',
}

const PartsForm = ({
  defaultValues,
  onSuccess,
  onError,
}: {
  defaultValues?: Partial<z.infer<typeof PartSchema>> & {
    id?: string
    vehicleId?: string
  }
  onSuccess?: () => void
  onError?: (err: Error) => void
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const { vehicleId: rawVehicleId, partId: rawPartId } = useParams()
  const vehicleId =
    typeof rawVehicleId === 'string' || typeof rawVehicleId === 'number'
      ? rawVehicleId
      : ''
  const partId =
    typeof rawPartId === 'string' || typeof rawPartId === 'number'
      ? rawPartId
      : ''

  const {
    upload,
    isError: isFileUploadError,
    error: fileUploadError,
    isLoading: isUploadPending,
  } = useFileUpload()

  const form = useForm<z.infer<typeof PartSchema>>({
    resolver: zodResolver(PartSchema),
    defaultValues: defaultValues ?? {
      partName: '',
      partNumber: '',
      startOdo: '',
      endOdo: '',
      startDate: '',
      endDate: '',
    },
  })

  const router = useRouter()

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...defaultValues,
        startOdo: defaultValues.startOdo?.toString() ?? '',
        endOdo: defaultValues.endOdo?.toString() ?? '',
      })
    }
  }, [defaultValues, form])

  const createMutation = useCreatePart({
    onSuccess: () => {
      form.reset()
      onSuccess?.()
      router.push(`/vehicles/${vehicleId}/parts`)
    },
    onError: (err) => {
      onError?.(err)
    },
  })

  const updateMutation = useUpdatePart({
    onSuccess: () => {
      onSuccess?.()
      showToast.success('Part Added')
      router.push(`/vehicles/${vehicleId}/parts`)
    },
    onError: (err) => {
      onError?.(err)
      showToast.error('Failed to add Part!')
      router.push(`/vehicles/${vehicleId}/parts`)
    },
  })

  const { isError: isMutationError, error: mutationError } = updateMutation

  const onSubmit = async (values: z.infer<typeof PartSchema>) => {
    let image = defaultValues?.image ?? null
    if (selectedImage) {
      const publicId = defaultValues?.id ?? Date.now().toString()
      const uploaded = await upload({
        file: selectedImage,
        type: 'parts',
        publicId,
      })
      image = uploaded ?? null
    }
    const updatedValues = {
      ...values,
      image,
    }
    if (defaultValues?.id) {
      updateMutation.mutate({
        vehicleId,
        partId,
        ...updatedValues,
      })
    } else {
      createMutation.mutate({
        vehicleId: defaultValues?.vehicleId || vehicleId,
        ...updatedValues,
      })
    }
  }

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
    <div className='p-6 max-w-4xl space-y-4'>
      <div>
        <label
          htmlFor='part-image'
          className='relative cursor-pointer inline-block'
        >
          <div className='relative'>
            <Card className='h-40 w-40 rounded-full overflow-hidden shadow-lg ring-2 ring-zinc-200 dark:ring-zinc-700 relative'>
              {selectedImage ? (
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt='preview'
                  fill
                  className='object-cover'
                  sizes='240px'
                  priority
                />
              ) : (
                <ImageWithFallback
                  src={defaultValues?.image ?? '/uploads/car-photo.png'}
                  alt='part'
                  sizes='240px'
                  priority
                  fill
                  className='object-cover'
                />
              )}
            </Card>
          </div>
          <div className='bg-secondary rounded-lg absolute top-2 right-2 z-10 p-1'>
            <TiSpanner size={25} />
          </div>
          <input
            id='part-image'
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
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {(
            [
              'partName',
              'partNumber',
              'startOdo',
              'endOdo',
              'startDate',
              'endDate',
            ] as const
          ).map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='capitalize'>
                    {FIELD_LABELS[fieldName]}
                  </FormLabel>
                  <FormControl>
                    {fieldName === 'startOdo' || fieldName === 'endOdo' ? (
                      <OdoSlider
                        value={field.value || ''}
                        onChange={(val) =>
                          form.setValue(field.name, val.toString(), {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }
                      />
                    ) : (
                      <Input
                        {...field}
                        type={fieldName.includes('Date') ? 'date' : 'text'}
                        placeholder={FIELD_LABELS[fieldName]}
                        className='uppercase'
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type='submit' className='mt-4' disabled={isPending}>
            {isPending
              ? defaultValues?.id
                ? 'Updating...'
                : 'Adding...'
              : defaultValues?.id
              ? 'Update Part'
              : 'Add Part'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default PartsForm
