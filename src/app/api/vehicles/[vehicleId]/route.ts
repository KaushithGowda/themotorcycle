import { auth } from '@/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { vehicleId: string } }
) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { vehicleId } = params

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

    return NextResponse.json( vehicle, { status: 200 })
  } catch (error) {
    console.log('Error fetching vehicle details!', error)
    return NextResponse.json({ error }, { status: 400 })
  }
}

export async function PATCH(request: NextRequest,
  {params} : {params: {vehicleId: string}}) {    
  
  const session = await auth();
  if(!session || !session.user) {
    return NextResponse.json({error:'Unauthorized user!'},{status: 401})
  }

  const {vehicleId} = params;

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
        make: fields.make as string,
        model: fields.model as string,
        color: fields.color as string,
        dateOfReg: fields.dateOfReg as string,
        odoReading: fields.odoReading as string,
        regNumber: fields.regNumber as string,
        imgUrl: fields.imgUrl ? (fields.imgUrl as string) : undefined,
        cubicCapacity: fields.cubicCapacity as string,
        horsePower: fields.horsePower as string,
        torque: fields.torque as string,
      }
    })

    return NextResponse.json(update, {status: 200})
  } catch (error) {
    console.error('Error while updating the vehicle!', error);
    return NextResponse.json({error},{status: 500})
  }
}
