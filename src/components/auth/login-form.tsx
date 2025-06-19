'use client'

import { LoginSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
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

import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'
import FormSuccess from '@/components/form-success'
import FormError from '@/components/form-error'
import { login } from '@/actions/login'

import { useState, useTransition } from 'react'

import { FaGoogle } from 'react-icons/fa'
import { signIn } from 'next-auth/react'
import { Default_Redirect_Path } from '@/routes'

const fonts = Poppins({
  weight: '600',
  subsets: ['latin'],
})

type LoginFormProps = {
  setUi: (value: 'login' | 'register') => void
}

const LoginForm = ({ setUi }: LoginFormProps) => {
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider'
      : ''
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      login(values).then((data) => {
        setError(data.error)
        setSuccess(data.success)
      })
    })
  }

  const onClickGoogle = async () => {
    await signIn('google', {
      redirectTo: Default_Redirect_Path,
    })
  }

  return (
    <>
      <Form {...form}>
        <form
          className='flex flex-col gap-2 p-6 md:p-8'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col items-center text-center'>
              <h1 className='text-2xl font-bold'>Welcome back</h1>
              <p className='text-muted-foreground text-balance'>
                Login to your Garage
              </p>
            </div>
            <div className='grid gap-3'>
              <FormField
                name='email'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center'>
                      <FormLabel className={cn('capitalize', fonts.className)}>
                        {field.name}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        type='email'
                        placeholder='joe@gmail.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='grid gap-3'>
            <FormField
              name='password'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center'>
                    <FormLabel className={cn('capitalize', fonts.className)}>
                      {field.name}
                    </FormLabel>
                    <a
                      href='#'
                      className='ml-auto text-sm underline-offset-2 hover:underline'
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      className='capitalize'
                      placeholder='********'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error || urlError} />
          <Button
            disabled={isPending}
            type='submit'
            className='w-full cursor-pointer'
          >
            Login
          </Button>
          <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
            <span className='bg-card text-muted-foreground relative z-10 px-2'>
              Or continue with
            </span>
          </div>
          <div className='grid grid-cols-1 gap-4'>
            {/* <Button variant='outline' type='button' className='w-full'>
                  <FaApple />
                </Button> */}
            <Button
              onClick={onClickGoogle}
              variant='outline'
              type='button'
              className='w-full cursor-pointer'
            >
              <FaGoogle />
              <span className='text-sm'>Login with Google</span>
            </Button>
            {/* <Button variant='outline' type='button' className='w-full'>
                  <FaMeta />
                </Button> */}
          </div>
          <div className='text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Button
              onClick={() => setUi('register')}
              type='button'
              variant='link'
              className='cursor-pointer px-1'
            >
              Sign up
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default LoginForm
