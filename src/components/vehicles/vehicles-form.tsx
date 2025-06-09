'use client'

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
import { useCreateVehicle } from '@/hooks/use-create-vehicle'
import { useState } from 'react'

const VehicleForm = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const form = useForm<z.infer<typeof VehicleSchema>>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: {
      name: '',
      make: '',
      model: '',
      color: '',
      year: 1969,
      odoReading: 0,
      regNumber: '',
    },
  })

  const mutation = useCreateVehicle({
    onSuccess: () => {
      setSuccess('Vehicle created successfully')
      setError('')
      form.reset()
    },
    onError: (err: Error) => {
      setError(err.message)
      setSuccess('')
    },
  })

  const onSubmit = (values: z.infer<typeof VehicleSchema>) => {
    mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {(
          [
            'name',
            'make',
            'model',
            'color',
            'year',
            'odoReading',
            'regNumber',
          ] as const
        ).map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='capitalize'>{fieldName}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={fieldName}
                    {...field}
                    disabled={mutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {error && <p className='text-red-500'>{error}</p>}
        {success && <p className='text-green-600'>{success}</p>}
        <Button type='submit' disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create Vehicle'}
        </Button>
      </form>
    </Form>
  )
}

export default VehicleForm
