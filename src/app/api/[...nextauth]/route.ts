import { handlers } from '@/auth' // Referring to the auth.ts we just created
export const { GET, POST } = handlers
console.log('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID)
console.log('GOOGLE_CLIENT_SECRET', process.env.GOOGLE_CLIENT_SECRET)