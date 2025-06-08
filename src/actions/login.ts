'use server'

import { signIn } from '@/auth'
import { Default_Redirect_Path } from '@/routes'
import { LoginSchema } from '@/schemas'
import { AuthError } from 'next-auth'
import { z } from 'zod'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values)
  
  if (!validateFields.success) return { error: 'Invalid Field!' }
  const { email, password } = validateFields.data

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: Default_Redirect_Path,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.message) {
        case 'Invalid credentials':
          return { error: 'Invalid email or password' }
        default:
          return { error: 'An unknown error occurred' }
      }
    }
    throw error
  }

  return { success: 'User logged in successfully' }
}
