'use client'

import LoginForm from '@/components/auth/login-form'
import RegisterForm from '@/components/auth/register-form'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { useState } from 'react'

const Auth = () => {
  const [ui, setUi] = useState<'login' | 'register'>('login')

  return (
    <div className='flex flex-col gap-6'>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          {ui === 'login' ? <LoginForm setUi={setUi}/> : <RegisterForm setUi={setUi}/>}
          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/uploads/themotorcycle.png'
              alt='Image'
              height={100}
              width={100}
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  )
}

export default Auth
