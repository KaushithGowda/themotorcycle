'use server'

import { RegisterSchema } from '@/schemas'
import { z } from 'zod'

import bcrypt from 'bcryptjs'

import { db } from '@/lib/utils/db'
import { getUserByEmail } from '@/data/user'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  
  const validateFields = RegisterSchema.safeParse(values)

  if (!validateFields.success) return { error: 'Invalid Field!' }

  const { email, name, password } = validateFields.data

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const existingUser = await getUserByEmail(email)

  if (existingUser) return { error: 'User already exists' }

  await db.user.create({
    data: {
      name,
      email: email,
      password: hashedPassword,
    },
  })

  return { success: 'User created successfully!' }
}