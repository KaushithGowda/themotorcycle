

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'


export async function GET(
  request: NextRequest,
  { params }: { params: { partId: string } }
) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { partId } = params

  try {
    const part = await db.part.findUnique({
      where: { id: partId },
    })

    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 })
    }

    return NextResponse.json(part, { status: 200 })
  } catch (error) {
    console.error('Error fetching part:', error)
    return NextResponse.json({ error: 'Failed to fetch part' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { partId: string } }
) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { partId } = params
  const body = await request.json()

  try {
    const updatedPart = await db.part.update({
      where: {
        id: partId,
      },
      data: {
        partName: body.partName,
        partNumber: body.partNumber,
        startOdo: body.startOdo,
        endOdo: body.endOdo,
        startDate: body.startDate,
        endDate: body.endDate,
      },
    })

    return NextResponse.json(updatedPart, { status: 200 })
  } catch (error) {
    console.error('Error updating part:', error)
    return NextResponse.json({ error: 'Failed to update part' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { partId: string } }
) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { partId } = params

  try {
    await db.part.delete({
      where: {
        id: partId,
      },
    })

    return NextResponse.json({ message: 'Part deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting part:', error)
    return NextResponse.json({ error: 'Failed to delete part' }, { status: 500 })
  }
}