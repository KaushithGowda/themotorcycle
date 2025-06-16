'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { ProfileSchema } from '@/schemas'
import { useGetProfile } from '@/hooks/profile/use-get-profile'
import { useUpdateProfile } from '@/hooks/profile/use-update-profile'
import { useRouter } from 'next/navigation'
import { useFileUpload } from '@/hooks/fileUpload/use-file-upload'
import Image from 'next/image'
import { Card } from '../ui/card'
import { showToast } from '@/lib/utils/toast'
import { useToast } from '@/hooks/utils/use-toast'

interface UpdateProfileMutationOptions {
  onSuccess: () => void
  onError: (err: unknown) => void
}

const ProfileForm = ({
  defaultValues,
}: {
  defaultValues: z.infer<typeof ProfileSchema>
}) => {
  const { data: profile, isError, error } = useGetProfile()
  const router = useRouter()
  const {
    upload,
    isError: isFileUploadError,
    error: fileUploadError,
  } = useFileUpload()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues,
  })

  console.log(profile);

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        image: profile.image || '',
        phoneNumber: profile.phoneNumber || '',
        dexp: profile.dexp || '',
        rexp: profile.rexp || '',
      })
    }
  }, [profile, form])

  useEffect(() => {
    if (selectedImage) {
      const previewUrl = URL.createObjectURL(selectedImage)
      return () => URL.revokeObjectURL(previewUrl)
    }
  }, [selectedImage])

  const updateMutation = useUpdateProfile({
    onSuccess: (): void => {
      showToast.success('Profile Updated!')
      router.push('/profile')
    },
    onError: (err: unknown): void => {
      console.error('Failed to update profile:', err)
    },
  } as UpdateProfileMutationOptions)

  const { isError: isMutationError, error: mutationError } = updateMutation

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    if (selectedImage && profile?.id) {
      const url = await upload(
        selectedImage,
        'profiles',
        `profile_image_${profile.id}`
      )
      if (url) {
        values.image = url
      }
    }
    updateMutation.mutate({
      ...values,
      image: values.image ?? undefined,
      phoneNumber: values.phoneNumber ?? undefined,
      dexp: values.dexp ?? undefined,
      rexp: values.rexp ?? undefined,
    })
  }

  useToast({
    isError: isMutationError,
    errorMsg: mutationError?.message,
  })

  useToast({
    isError: isFileUploadError,
    errorMsg: fileUploadError?.message,
  })

  useToast({
    isError,
    errorMsg: error?.message,
  })

  return (
    <div className='max-w-xl'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex justify-center sm:justify-start mb-4'>
            <label
              aria-label='Upload profile image'
              htmlFor='profile-image'
              className='cursor-pointer flex justify-center'
            >
              <div className='relative'>
                <Card className='h-40 w-40 rounded-full overflow-hidden shadow-lg ring-2 ring-zinc-200 dark:ring-zinc-700 relative'>
                  {selectedImage ? (
                    <Image
                      src={URL.createObjectURL(selectedImage)}
                      alt='preview'
                      fill
                      className='object-cover'
                      style={{ objectFit: 'cover' }}
                      sizes='160px'
                      priority
                    />
                  ) : (
                    <Image
                      src={form.watch('image') || '/fallback.png'}
                      alt='profile'
                      fill
                      className='object-cover'
                    />
                  )}
                </Card>
              </div>
              <Input
                id='profile-image'
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSelectedImage(file)
                  }
                }}
                className='hidden'
              />
            </label>
          </div>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter your phone number'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dexp'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driving Since</FormLabel>
                <FormControl>
                  <Input type='date' {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='rexp'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Riding Since</FormLabel>
                <FormControl>
                  <Input type='date' {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Update Profile</Button>
        </form>
      </Form>
    </div>
  )
}

export default ProfileForm
