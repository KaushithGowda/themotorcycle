'use client'

import { useGetParts } from '@/hooks/parts/use-get-parts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FaPen, FaLongArrowAltRight } from 'react-icons/fa'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export const PartsList = () => {
  const {vehicleId} = useParams();
  console.log({vehicleId});
  
  const { data: parts, isLoading, isError } = useGetParts(String(vehicleId ?? ''))

  if (isError) return <p>Error loading parts.</p>
  if (isLoading) return <p>Loading parts...</p>
  if (!parts || parts.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 w-full'>
        <h1 className='text-3xl font-bold'>No Parts Added Yet</h1>
        <p className='text-muted-foreground text-lg'>
          Keep track of all parts used on your vehicles
        </p>
        <Button asChild>
          <Link href={`/vehicles/${vehicleId}/parts/new`}>Add Part</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='flex flex-wrap gap-5'>
      {parts.map((part) => (
        <Card
          key={part.id}
          className='relative w-72 min-h-[250px] py-0 rounded-2xl overflow-hidden shadow-lg border'
        >
          <Button
            asChild
            variant='secondary'
            size='icon'
            className='absolute top-2 right-2 z-10 p-1 cursor-pointer'
          >
            <Link href={`/vehicles/${vehicleId}/parts/${part.id}`}>
              <FaPen size={18} />
            </Link>
          </Button>
          <div className='px-4 py-4'>
            <span className='font-extrabold text-lg text-primary capitalize'>
              {part.partName}
            </span>
            <div className='flex items-center gap-2 text-xs text-muted-foreground mt-1'>
              <span>Part No: {part.partNumber}</span>
              <Separator orientation='vertical' className='h-4' />
              <span>ODO: {part.startOdo} - {part.endOdo}</span>
            </div>
            <div className='text-xs text-muted-foreground mt-2'>
              {part.startDate} → {part.endDate}
            </div>
            <div className='mt-4'>
              <Button asChild variant='link' className='text-primary p-0 text-xs'>
                <Link href={`/parts/${part.id}`}>
                  View Details <FaLongArrowAltRight className='ml-1 inline-block' />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
      <Link href='/parts/new'>
        <Card className='w-72 min-h-[250px] rounded-2xl overflow-hidden flex items-center justify-center border-dashed border-2 border-primary text-primary hover:bg-muted transition'>
          <span className='text-6xl'>+</span>
        </Card>
      </Link>
    </div>
  )
}
