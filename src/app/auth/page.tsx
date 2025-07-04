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
              src='/uploads/motorcycle-photo.png'
              alt='Image'
              height={100}
              width={100}
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Auth
