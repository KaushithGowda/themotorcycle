import { VehicleList } from '@/components/vehicles/vehicles-list'

export default function Home() {
  return (
    <div className='flex flex-wrap gap-5 px-2 py-5 sm:px-5 sm:py-5'>
      <VehicleList />
    </div>
  )
}
