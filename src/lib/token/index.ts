import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { email?: string }
  } catch (error) {
    console.error('Invalid JWT', error)
    return null
  }
}