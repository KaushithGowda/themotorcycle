import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import formidable from 'formidable'
import { db } from '@/lib/db'
import path from 'path'
import fs from 'fs/promises'

const uploadDir = path.join(process.cwd(), 'public', 'uploads')

async function parseForm(
  req: NextRequest
): Promise<[formidable.Fields, formidable.Files]> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir,
    })

    // Use the native Node.js request stream directly
    const nodeReq = Object.assign(req, {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: '',
    })

    // Import IncomingMessage from 'http' at the top of the file:
    // import { IncomingMessage } from 'http'
    form.parse(
      nodeReq as unknown as import('http').IncomingMessage,
      (err, fields, files) => {
        if (err) reject(err)
        else resolve([fields, files])
      }
    )
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

    const make = Array.isArray(fields.make) ? fields.make[0] : fields.make ?? ''
    const model = Array.isArray(fields.model) ? fields.model[0] : fields.model ?? ''
    const color = Array.isArray(fields.color) ? fields.color[0] : fields.color ?? ''
    const dateOfReg = Array.isArray(fields.dateOfReg) ? fields.dateOfReg[0] : fields.dateOfReg ?? new Date().toISOString()
    const odoReading = Array.isArray(fields.odoReading)
      ? fields.odoReading[0]
      : fields.odoReading ?? '0'
    const regNumber = Array.isArray(fields.regNumber)
      ? fields.regNumber[0]
      : fields.regNumber ?? ''
    const horsePower = fields.horsePower ?? null
    const torque = fields.torque ?? null
    const cubicCapacity = fields.cubicCapacity ?? null

    const image = Array.isArray(files?.imgUrl)
      ? files.imgUrl[0]
      : files?.imgUrl ?? null
    let imgUrl: string | null = null
    if (image && (image as formidable.File).filepath) {
      imgUrl = `/uploads/${path.basename((image as formidable.File).filepath)}`
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
        horsePower: Array.isArray(horsePower) ? horsePower[0] : horsePower ?? null,
        torque: Array.isArray(torque) ? torque[0] : torque ?? null,
        cubicCapacity: Array.isArray(cubicCapacity) ? cubicCapacity[0] : cubicCapacity ?? null,
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

interface VehicleUpdateData {
  make?: string
  model?: string
  color?: string
  dateOfReg?: string
  odoReading?: string
  regNumber?: string
  cubicCapacity?: string
  horsePower?: string
  torque?: string
  imgUrl?: string
}

export async function PATCH(request: NextRequest) {
  const session = await auth()

  if (!session || !session?.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await fs.mkdir(uploadDir, { recursive: true })

    const [fields, files] = await parseForm(request)

    const url = request.nextUrl.pathname
    const parts = url.split('/')
    const vehicleId = parts[parts.indexOf('vehicles') + 1]

    if (!vehicleId) {
      return NextResponse.json({ error: 'Vehicle ID missing' }, { status: 400 })
    }

    const data: VehicleUpdateData = {
      make: fields.make?.[0] ?? '',
      model: fields.model?.[0] ?? '',
      color: fields.color?.[0] ?? '',
      dateOfReg: fields.dateOfReg?.[0] ?? new Date().toISOString(),
      odoReading: fields.odoReading?.[0] ?? '0',
      regNumber: fields.regNumber?.[0] ?? '',
    }

    data.cubicCapacity = fields.cubicCapacity?.[0] ?? ''
    data.horsePower = fields.horsePower?.[0] ?? ''
    data.torque = fields.torque?.[0] ?? ''

    const image = Array.isArray(files?.imgUrl)
      ? (files.imgUrl[0] as formidable.File)
      : (files?.imgUrl as unknown as formidable.File)
    if (image?.filepath)
      data.imgUrl = `/uploads/${path.basename(image.filepath)}`

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
