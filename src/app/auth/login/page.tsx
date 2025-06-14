import LoginForm from '@/components/auth/login-form'
import { Suspense } from 'react'

const LoginPage = async () => {
  return (
    <>
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </>
  )
}

export default LoginPage
