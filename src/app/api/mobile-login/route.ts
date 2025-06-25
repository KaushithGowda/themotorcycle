// src/app/api/mobile-login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/data/user'
import { LoginSchema } from '@/schemas'
import bcrypt from 'bcryptjs'
import { signJwt } from '@/lib/jwt'

export async function POST(req: NextRequest) {

  const body = await req.json()
  const result = LoginSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { email, password } = result.data
  const user = await getUserByEmail(email)

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (!user.password) {
    return NextResponse.json(
      {
        error:
          'This email is registered via Google Sign-In. Please use Google login.',
      },
      { status: 403 }
    )
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = signJwt({ id: user.id, email: user.email })

  return NextResponse.json({
    token,
    user: { id: user.id, email: user.email },
  })
}
