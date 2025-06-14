'use client'

import { useState, useTransition } from 'react'

import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'
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

import { RegisterSchema } from '@/schemas'
import { register } from '@/actions/register'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

type RegisterFormProps = {
  setUi: (value: 'login' | 'register') => void
}

const RegisterForm = ({ setUi }: RegisterFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error)
        setSuccess(data.success)
      })
    })
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-2 p-6 md:p-8'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center text-center'>
            <h1 className='text-2xl font-bold'>Hey there, Welcome</h1>
            <p className='text-muted-foreground text-balance'>
              Sign up to themotorcycle
            </p>
          </div>
          <div className='grid gap-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center'>
                    <FormLabel className='capitalize'>{field.name}</FormLabel>
                  </div>
                  <FormControl>
                    <Input placeholder='joe' disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid gap-3'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center'>
                    <FormLabel className='capitalize'>{field.name}</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type='email'
                      disabled={isPending}
                      placeholder='joe@gmail.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid gap-3'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center'>
                    <FormLabel className='capitalize'>{field.name}</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='************'
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          type='submit'
          className='w-full cursor-pointer'
          disabled={isPending}
        >
          Create an accout
        </Button>
        <div className='text-center text-sm'>
          Already have an account?{' '}
          <Button
            onClick={() => setUi('login')}
            variant='link'
            type='button'
            className='cursor-pointer px-1'
          >
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RegisterForm
