import { z } from 'zod'

export const LoginSchema = z.object({
  email: z
    .string()
    .min(5, { message: 'Email must be at least 2 characters' })
    .max(15, { message: 'Email cannot be more than 15 characters' })
    .nonempty(),
  password: z
    .string()
    .min(5, { message: 'Password must be at least 2 characters' })
    .max(15, { message: 'Password cannot be more than 15 characters' })
    .nonempty(),
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
  //   message:
  //     'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character',
  // }),
})

export const RegisterSchema = z.object({
  email: z
    .string()
    .min(5, { message: 'Email must be at least 2 characters' })
    .max(15, { message: 'Email cannot be more than 15 characters' })
    .nonempty({ message: 'Email is required' }),
  name: z
    .string()
    .min(5, { message: 'Name must be at least 2 characters' })
    .max(15, { message: 'Name cannot be more than 15 characters' })
    .nonempty({ message: 'Name is required' }),
  password: z
    .string()
    .min(5, { message: 'Password must be at least 2 characters' })
    .max(15, { message: 'Password cannot be more than 15 characters' })
    .nonempty({ message: 'Password is required' }),
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
  //   message:
  //     'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character',
  // }),
})

export const VehicleSchema = z.object({
  make: z
    .string()
    .min(3, { message: 'Make must be at least 3 characters' })
    .max(15, { message: 'Make cannot be more than 15 characters' })
    .nonempty({ message: 'Make is required' }),
  model: z
    .string()
    .min(3, { message: 'Model must be at least 3 characters' })
    .max(15, { message: 'Model cannot be more than 15 characters' })
    .nonempty({ message: 'Model is required' }),
  color: z
    .string()
    .nonempty({ message: 'Color is required' })
    .refine(
      (val) =>
        [
          'black',
          'white',
          'gray',
          'silver',
          'red',
          'blue',
          'green',
          'yellow',
          'orange',
          'brown',
          'purple',
          'pink',
          'gold',
        ].includes(val),
      { message: 'Invalid color selected' }
    ),
  dateOfReg: z
    .string()
    .nonempty({ message: 'Registration date is required' })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid registration date',
    }),
  odoReading: z
    .number()
    .min(0, { message: 'Odometer must be at least 0' })
    .max(9999999, { message: 'Odometer cannot exceed 7 digits' }),
  regNumber: z
    .string()
    .min(5, { message: 'Register number must be at least 5 characters' })
    .max(10, { message: 'Register number cannot be more than 10 characters' })
    .nonempty({ message: 'Register number is required' }),
  imgUrl: z.string().optional().nullable(),
  cubicCapacity: z.string().optional(),
  horsePower: z.string().optional(),
  torque: z.string().optional(),
})

export const PartSchema = z.object({
  partName: z.string().min(1, { message: 'Part name is required' }),
  partNumber: z.string().min(1, { message: 'Part number is required' }),
  startOdo: z.string().nonempty({ message: 'Start Odo is required' }),
  endOdo: z.string().nonempty({ message: 'End Odo is required' }),
  imgUrl: z.string().optional().nullable(),
  startDate: z.string().nonempty({ message: 'Start date is required' }),
  endDate: z.string().nonempty({ message: 'End date is required' }),
})

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(15, { message: 'Name cannot be more than 15 characters' })
    .nonempty({ message: 'Name is required' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number cannot be more than 15 digits' })
    .optional()
    .nullable(),
  image: z.string().optional().nullable(),
  dexp: z.string().optional().nullable(),
  rexp: z.string().optional().nullable(),
})
