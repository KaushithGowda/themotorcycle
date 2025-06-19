import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { PartSchema } from '@/schemas'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const partId = request.nextUrl.pathname.split('/').pop()

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

export async function PATCH(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const partId = request.nextUrl.pathname.split('/').pop()
  const body = await request.json()
  const result = PartSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid part data' }, { status: 400 })
  }

  const validatedData = result.data

  try {
    const updatedPart = await db.part.update({
      where: {
        id: partId,
      },
      data: {
        ...validatedData,
      },
    })

    return NextResponse.json({ part: updatedPart }, { status: 200 })
  } catch (error) {
    console.error('Error updating part:', error)
    return NextResponse.json(
      { error: 'Failed to update part' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const partId = request.nextUrl.pathname.split('/').pop()

  try {
    await db.part.delete({
      where: {
        id: partId,
      },
    })

    return NextResponse.json(
      { message: 'Part deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting part:', error)
    return NextResponse.json(
      { error: 'Failed to delete part' },
      { status: 500 }
    )
  }
}
