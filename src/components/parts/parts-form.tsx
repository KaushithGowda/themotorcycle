'use client'

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
import { PartSchema } from '@/schemas'
import OdoSlider from '@/components/vehicles/odo-slider'
import { useCreatePart } from '@/hooks/parts/use-create-part'
import { useUpdatePart } from '@/hooks/parts/use-update-part'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const PartsForm = ({
  defaultValues,
  onSuccess,
  onError,
}: {
  defaultValues?: Partial<z.infer<typeof PartSchema>> & { id?: string; vehicleId?: string }
  onSuccess?: () => void
  onError?: (err: Error) => void
}) => {
  const {vehicleId, partId} = useParams();

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
      router.push(`/vehicles/${vehicleId}/parts`)
    },
    onError: (err) => {
      onError?.(err)
    },
  })

  const onSubmit = (values: z.infer<typeof PartSchema>) => {
    try {
      console.log('Submitting values:', values)
      if (defaultValues?.id) {
        updateMutation.mutate({
          id: defaultValues.id,
          vehicleId,
          partId,
          ...values,
        })
      } else {
        createMutation.mutate({
          vehicleId: defaultValues?.vehicleId || vehicleId,
          ...values,
        })
      }
    } catch (err) {
      onError?.(err as Error)
    }
  }

  return (
    <div className='p-6 max-w-4xl'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error('Form validation errors:', errors);
          onError?.(new Error('Form validation failed'));
        })} className='space-y-4'>
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
                    {fieldName === 'startOdo'
                      ? 'Start Odo'
                      : fieldName === 'endOdo'
                      ? 'End Odo'
                      : fieldName === 'startDate'
                      ? 'Start Date'
                      : fieldName === 'endDate'
                      ? 'End Date'
                      : fieldName === 'partName'
                      ? 'Part Name'
                      : fieldName === 'partNumber'
                      ? 'Part Number'
                      : fieldName}
                  </FormLabel>
                  {fieldName === 'startOdo' || fieldName === 'endOdo' ? (
                    <FormControl>
                      <OdoSlider
                        value={Number(field.value || 0)}
                        onChange={(val) =>
                          form.setValue(field.name, val.toString(), {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }
                      />
                    </FormControl>
                  ) : (
                    <FormControl>
                      <Input
                        placeholder={fieldName}
                        {...field}
                        type={fieldName.includes('Date') ? 'date' : 'text'}
                        className='uppercase'
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type='submit' className='mt-4' disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending
              ? defaultValues?.id ? 'Updating...' : 'Adding...'
              : defaultValues?.id ? 'Update Part' : 'Add Part'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default PartsForm
