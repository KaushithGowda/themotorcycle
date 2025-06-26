import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { verifyJwt } from '@/lib/token'

// GET current user profile
export async function GET(req: NextRequest) {
  console.log('here',req);
  
  let email: string | null = null

  // Try to get session from cookie (web)
  const session = await auth()
  if (session?.user?.email) {
    email = session.user.email
  } else {
    // Fallback to JWT (mobile)
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    if (token) {
      const payload = await verifyJwt(token)
      if (payload?.email && typeof payload.email === 'string') {
        email = payload.email
      }
    }
  }

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        vehicles: true,
        createdAt: true,
        dexp: true,
        rexp: true,
        emailVerified: true
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PATCH update user profile
export async function PATCH(req: NextRequest) {
  let email: string | null = null

  // Try to get session from cookie (web)
  const session = await auth()
  if (session?.user?.email) {
    email = session.user.email
  } else {
    // Fallback to JWT (mobile)
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    if (token) {
      const payload = await verifyJwt(token)
      if (payload?.email && typeof payload.email === 'string') {
        email = payload.email
      }
    }
  }

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, image, phoneNumber, dexp, rexp } = body

    const updatedUser = await db.user.update({
      where: { email },
      data: {
        name,
        image,
        phoneNumber,
        dexp,
        rexp,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phoneNumber: true,
        dexp: true,
        rexp: true,
      },
    })

    return NextResponse.json({ user: updatedUser }, { status: 200 })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}