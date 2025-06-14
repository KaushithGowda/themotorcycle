/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import formidable from 'formidable'
import { db } from '@/lib/db'
import path from 'path'
import fs from 'fs/promises'
import { Readable } from 'stream'


const uploadDir = path.join(process.cwd(), 'public', 'uploads')

async function parseForm(req: NextRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir,
    })

    // Convert Web ReadableStream to Node Readable
    const nodeReq = Object.assign(Readable.fromWeb(req.body as any), {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: '',
    })

    form.parse(nodeReq as any, (err, fields, files) => {
      if (err) reject(err)
      else resolve([fields, files])
    })
  })
}
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await fs.mkdir(uploadDir, { recursive: true })

    const [fields, files] = await parseForm(request)
    console.log({ fields, files })

    const make = fields.make ?? null
    const model = fields.model ?? null
    const color = fields.color ?? null
    const dateOfReg = fields.dateOfReg ?? new Date().toISOString()
    const odoReading = fields.odoReading ?? '0'
    const regNumber = fields.regNumber ?? null
    const horsePower = fields.horsePower ?? null
    const torque = fields.torque ?? null
    const cubicCapacity = fields.cubicCapacity ?? null

    const image = files?.imgUrl ?? null
    let imgUrl: string | null = null
    if (image?.filepath) {
      imgUrl = `/uploads/${path.basename(image.filepath)}`
    }

    console.log('Received form:', { fields, files })

    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
    })

    if (!user) {
      console.error('User not found for session:', session.user.email)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const newVehicle = await db.vehicle.create({
      data: {
        color,
        make,
        model,
        odoReading,
        regNumber,
        dateOfReg,
        horsePower: horsePower ?? null,
        torque: torque ?? null,
        cubicCapacity: cubicCapacity ?? null,
        imgUrl,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { vehicleId: string } }
) {
  const session = await auth()

  if (!session || !session?.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await fs.mkdir(uploadDir, { recursive: true })

    const [fields, files] = await parseForm(request)

    const { vehicleId } = params

    if (!vehicleId) {
      return NextResponse.json({ error: 'Vehicle ID missing' }, { status: 400 })
    }

    const data: any = {
      make: fields.make?.[0],
      model: fields.model?.[0],
      color: fields.color?.[0],
      dateOfReg: fields.dateOfReg?.[0] ?? new Date().toISOString(),
      odoReading: Number(fields.odoReading?.[0]) || 0,
      regNumber: fields.regNumber?.[0],
    }

    if (fields.cubicCapacity?.[0]) data.cubicCapacity = fields.cubicCapacity[0]
    if (fields.horsePower?.[0]) data.horsePower = fields.horsePower[0]
    if (fields.torque?.[0]) data.torque = fields.torque[0]

    const image = files?.image?.[0]
    if (image) data.imgUrl = `/uploads/${path.basename(image.filepath)}`

    const updatedVehicle = await db.vehicle.update({
      where: {
        id: vehicleId,
      },
      data,
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
