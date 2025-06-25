// src/app/api/mobile-login/google/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { signJwt } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    const ticket = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    )
    const profile = await ticket.json()

    if (!profile?.email) {
      return NextResponse.json(
        { error: 'Invalid Google token' },
        { status: 401 }
      )
    }

    // Find or create user
    let user = await db.user.findUnique({ where: { email: profile.email } })

    if (!user) {
      user = await db.user.create({
        data: {
          email: profile.email,
          name: profile.name || 'google user',
          image: profile.picture || null,
          emailVerified: new Date(),
        },
      })
    }

    const jwt = signJwt({ id: user.id, email: user.email })

    return NextResponse.json({
      token: jwt,
      user: { id: user.id, email: user.email },
    })
  } catch (e) {
    console.error({ error: e })
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    )
  }
}
