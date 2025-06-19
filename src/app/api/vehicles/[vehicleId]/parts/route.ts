import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { PartSchema } from '@/schemas'

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pathParts = request.nextUrl.pathname.split('/')
  const vehicleId = pathParts[pathParts.indexOf('vehicles') + 1]

  if (!vehicleId) {
    return NextResponse.json({ error: 'Vehicle ID missing' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const result = PartSchema.safeParse(body)

    if(!result.success) return NextResponse.json(
        { error: 'Invalid part data' },
        { status: 400 }
      )

    const validatedData = result.data
    console.log({body},{result},{validatedData});

    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    const part = await db.part.create({
      data: {
        vehicleId,
        ...validatedData
      },
    })

    return NextResponse.json({ part }, { status: 201 })
  } catch (error) {
    console.error('Error creating part', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pathParts = request.nextUrl.pathname.split('/')
  const vehicleId = pathParts[pathParts.indexOf('vehicles') + 1]

  if (!vehicleId) {
    return NextResponse.json({ error: 'Vehicle ID missing' }, { status: 400 })
  }

  try {
    const parts = await db.part.findMany({
      where: { vehicleId },
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            image: true,
            coverImage: true,
          },
        },
      },
    })

    return NextResponse.json({ parts }, { status: 200 })
  } catch (error) {
    console.error('Error fetching parts', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}