import { auth } from '@/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized user!' }, { status: 401 })
  }

  const parts = request.nextUrl.pathname.split('/');
  const vehicleId = parts[parts.indexOf('vehicles') + 1];

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {    
  
  const session = await auth();
  if(!session || !session.user) {
    return NextResponse.json({error:'Unauthorized user!'},{status: 401})
  }

  const parts = request.nextUrl.pathname.split('/');
  const vehicleId = parts[parts.indexOf('vehicles') + 1];

  console.log({vehicleId});

  if(!vehicleId) {
    return NextResponse.json({error: 'Vehicle Id missing'},{status: 400})
  }

  try {
    const formData = await request.formData();
    const fields = Object.fromEntries(formData);

    const update = await db.vehicle.update({
      where: {id: vehicleId},
      data: {
        make: fields.make?.toString(),
        model: fields.model?.toString(),
        color: fields.color?.toString(),
        dateOfReg: fields.dateOfReg?.toString(),
        odoReading: fields.odoReading?.toString(),
        regNumber: fields.regNumber?.toString(),
        imgUrl: fields.imgUrl ? fields.imgUrl.toString() : undefined,
        cubicCapacity: fields.cubicCapacity?.toString(),
        horsePower: fields.horsePower?.toString(),
        torque: fields.torque?.toString(),
      }
    })

    return NextResponse.json(update, {status: 200})
  } catch (error) {
    console.error('Error while updating the vehicle!', error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}
