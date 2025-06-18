import { cn } from '@/lib/utils'

const COLOR_MAP: Record<string, string> = {
  black: 'bg-black',
  white: 'bg-white',
  gray: 'bg-gray-500',
  silver: 'bg-gray-300',
  red: 'bg-red-600',
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  yellow: 'bg-yellow-400',
  orange: 'bg-orange-500',
  brown: 'bg-yellow-800',
  purple: 'bg-purple-600',
  pink: 'bg-pink-500',
  gold: 'bg-yellow-300',
}

export const ColorBadge = ({ color }: { color: string }) => {
  const bgClass = COLOR_MAP[color] ?? 'bg-gray-200'

  return (
    <div className='flex items-center justify-center gap-1 capitalize'>
      <span
        className={cn('w-2 h-2 rounded-full border', bgClass)}
        aria-label={color}
      />
      {/* <span className='text-muted-foreground text-xs'>{color}</span> */}
    </div>
  )
}
