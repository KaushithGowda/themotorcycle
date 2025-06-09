import { z } from 'zod'

export const LoginSchema = z.object({
  email: z
    .string()
    .min(5, { message: 'email must be atleast 2 characters' })
    .max(15, { message: 'email cannot be more than 15 characters' })
    .nonempty(),
  password: z
    .string()
    .min(5, { message: 'password must be atleast 2 characters' })
    .max(15, { message: 'password cannot be more than 15 characters' })
    .nonempty(),
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
  //   message:
  //     'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character',
  // }),
})

export const RegisterSchema = z.object({
  email: z
    .string()
    .min(5, { message: 'email must be atleast 2 characters' })
    .max(15, { message: 'email cannot be more than 15 characters' })
    .nonempty({ message: 'email is required' }),
  name: z
    .string()
    .min(5, { message: 'name must be atleast 2 characters' })
    .max(15, { message: 'name cannot be more than 15 characters' })
    .nonempty({ message: 'name is required' }),
  password: z
    .string()
    .min(5, { message: 'password must be atleast 2 characters' })
    .max(15, { message: 'password cannot be more than 15 characters' })
    .nonempty({ message: 'password is required' }),
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
  //   message:
  //     'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character',
  // }),
})

export const VehicleSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'name must be atleast 5 characters' })
    .max(15, { message: 'name cannot be more than 15 characters' })
    .nonempty({ message: 'name is required' }),
  make: z
    .string()
    .min(3, { message: 'make must be atleast 3 characters' })
    .max(15, { message: 'make cannot be more than 15 characters' })
    .nonempty({ message: 'make is required' }),
  model: z
    .string()
    .min(3, { message: 'model must be atleast 3 characters' })
    .max(15, { message: 'model cannot be more than 15 characters' })
    .nonempty({ message: 'model is required' }),
  color: z
    .string()
    .min(3, { message: 'color must be atleast 3 characters' })
    .max(15, { message: 'color cannot be more than 15 characters' })
    .nonempty({ message: 'color is required' }),
  year: z.number(),
  odoReading: z
    .number()
    .max(7, { message: 'odoReading cannot be more than 7 characters' }),
  regNumber: z
    .string()
    .min(5, { message: 'Register Number must be atleast 5 characters' })
    .max(10, { message: 'Register Number cannot be more than 10 characters' })
    .nonempty({ message: 'Register Number is required' }),
})
