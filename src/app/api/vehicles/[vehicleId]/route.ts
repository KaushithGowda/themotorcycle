import { auth } from '@/auth'
import { db } from '@/lib/db'
import { VehicleSchema } from '@/schemas'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized user!' }, { status: 401 })
  }

  const parts = request.nextUrl.pathname.split('/')
  const vehicleId = parts[parts.indexOf('vehicles') + 1]

  if (!vehicleId) {
    return NextResponse.json({ error: 'Vehicle ID missing' }, { status: 400 })
  }

  try {
    const vehicle = await db.vehicle.findFirst({
      where: {
        id: vehicleId,
        user: {
          email: session.user.email as string,
        },
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json(vehicle, { status: 200 })
  } catch (error) {
    console.log('Error fetching vehicle details!', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth()

  if (!session || !session?.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const result = VehicleSchema.safeParse(body)

    if (!result)
      return NextResponse.json(
        {
          error: 'Invalid vehicle data',
        },
        { status: 400 }
      )

    const validatedData = result.data

    const url = request.nextUrl.pathname
    const parts = url.split('/')
    const vehicleId = parts[parts.indexOf('vehicles') + 1]

    if (!vehicleId) {
      return NextResponse.json({ error: 'Vehicle ID missing' }, { status: 400 })
    }

    const updatedVehicle = await db.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        ...validatedData,
      },
    })

    return NextResponse.json({ vehicle: updatedVehicle }, { status: 200 })
  } catch (error) {
    console.error('Error while updating the vehicle', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
