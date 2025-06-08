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
    .nonempty({message: 'email is required'}),
  name: z
    .string()
    .min(5, { message: 'name must be atleast 2 characters' })
    .max(15, { message: 'name cannot be more than 15 characters' })
    .nonempty({message: 'name is required'}),
  password: z
    .string()
    .min(5, { message: 'password must be atleast 2 characters' })
    .max(15, { message: 'password cannot be more than 15 characters' })
    .nonempty({message: 'password is required'}),
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
  //   message:
  //     'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character',
  // }),
})
