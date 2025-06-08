import LoginForm from '@/components/auth/login-form'
import { Suspense } from 'react'

const LoginPage = async () => {
  return (
    <div className='h-full flex items-center justify-center'>
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

export default LoginPage
