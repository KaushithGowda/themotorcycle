export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center absolute inset-0'>
      <span className='text-4xl font-bold'>404 - Not Found</span>
      <p className='text-muted-foreground'>
        Couldn’t find the page you’re looking for!
      </p>
    </div>
  )
}
