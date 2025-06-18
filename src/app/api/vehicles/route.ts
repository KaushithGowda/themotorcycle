import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { VehicleSchema } from '@/schemas'

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = VehicleSchema.safeParse(body)

    if (!result.success)
      return NextResponse.json(
        { error: 'Invalid vehicle data' },
        { status: 400 }
      )

    const validatedData = result.data

    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
    })

    if (!user) {
      console.error('User not found for session:', session.user.email)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const newVehicle = await db.vehicle.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    })

    return NextResponse.json({ vehicle: newVehicle }, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle!', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userWithVehicles = await db.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        vehicles: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!userWithVehicles) {
      return NextResponse.json({ vehicles: [] }, { status: 200 })
    }

    return NextResponse.json(
      { vehicles: userWithVehicles.vehicles },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching vehicles!', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}