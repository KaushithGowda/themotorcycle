'use client'

import { useState, useTransition } from 'react'

import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'
import CardWrapper from '@/components/auth/card-wrapper'
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
import { cn } from '@/lib/utils/utils'
import { register } from '@/actions/register'
import { Poppins } from 'next/font/google'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

const fonts = Poppins({
  weight: '600',
  subsets: ['latin'],
})

const RegisterForm = () => {
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

  console.log(form.getValues());

  return (
    <CardWrapper
      headerLabel='Register'
      headerTitle='🔐 Auth'
      showSocial
      backBtnLabel='Already registered ?'
      backBtnHref='/auth/login'
    >
      <Form {...form}>
        <form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn('capitalize', fonts.className)}>
                    {field.name}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='joe' disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn('capitalize', fonts.className)}>
                    {field.name}
                  </FormLabel>
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
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn('capitalize', fonts.className)}>
                    {field.name}
                  </FormLabel>
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type='submit'
            className='w-full cursor-pointer'
            disabled={isPending}
          >
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default RegisterForm
