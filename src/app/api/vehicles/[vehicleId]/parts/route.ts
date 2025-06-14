

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: { vehicleId: string } }) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { vehicleId } = params
  if (!vehicleId) {
    return NextResponse.json({ error: 'Vehicle ID missing' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const {
      partName,
      partNumber,
      startOdo,
      endOdo,
      startDate,
      endDate,
      imgUrl,
    } = body

    const vehicle = await db.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    const part = await db.part.create({
      data: {
        partName,
        partNumber,
        startOdo,
        endOdo,
        startDate,
        endDate,
        imgUrl,
        vehicleId,
      },
    })

    return NextResponse.json({ part }, { status: 201 })
  } catch (error) {
    console.error('Error creating part', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(_request: NextRequest, { params }: { params: { vehicleId: string } }) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { vehicleId } = params
  if (!vehicleId) {
    return NextResponse.json({ error: 'Vehicle ID missing' }, { status: 400 })
  }

  try {
    const parts = await db.part.findMany({
      where: {
        vehicleId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ parts }, { status: 200 })
  } catch (error) {
    console.error('Error fetching parts', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}