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
import { useEffect } from 'react'
import { ProfileSchema } from '@/schemas'
import { useGetProfile } from '@/hooks/profile/use-get-profile'
import { useUpdateProfile } from '@/hooks/profile/use-update-profile'
import { useRouter } from 'next/navigation'

interface UpdateProfileMutationOptions {
  onSuccess: () => void
  onError: (err: unknown) => void
}

const ProfileForm = ({
  defaultValues,
}: {
  defaultValues: z.infer<typeof ProfileSchema>
}) => {
  const { data: profile } = useGetProfile()
  const router = useRouter()

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues,
  })

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        imgUrl: profile.imgUrl || '',
      })
    }
  }, [profile, form])


  const updateMutation = useUpdateProfile({
    onSuccess: (): void => {
      console.log('Profile updated successfully')
      router.push('/profile')
    },
    onError: (err: unknown): void => {
      console.error('Failed to update profile:', err)
    },
  } as UpdateProfileMutationOptions)

  const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
    updateMutation.mutate(values)
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Your name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='imgUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder='https://example.com/image.jpg'
                    {...field}
                    value={field.value ?? ''}
                  />
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
