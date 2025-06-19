'use client'

import Image, { ImageProps } from 'next/image'

const fallbackSrc = '/uploads/image-not-found.jpg'

export function ImageWithFallback(props: ImageProps) {
  const { src, alt, ...rest } = props

  return (
    <Image
      {...rest}
      src={src || fallbackSrc}
      alt={alt}
    />
  )
}
