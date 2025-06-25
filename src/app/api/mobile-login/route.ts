// /pages/api/auth/mobile-login.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserByEmail } from '@/data/user'
import { LoginSchema } from '@/schemas'
import bcrypt from 'bcryptjs'
import { signJwt } from '@/lib/jwt' // You’ll need to implement this if not already

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Incoming mobile login request',req)
  if (req.method !== 'POST') return res.status(405).end()

  const body = req.body
  const result = LoginSchema.safeParse(body)

  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input' })
  }

  const { email, password } = result.data
  const user = await getUserByEmail(email)

  if (!user || !user.password) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = signJwt({ id: user.id, email: user.email }) // Must use HS256 with shared secret
  return res.status(200).json({ token, user: { id: user.id, email: user.email } })
}