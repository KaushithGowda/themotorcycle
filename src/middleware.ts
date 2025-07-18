// This is edge safe. This run on the edge servers
import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import {
  apiAuthPrefix,
  authRoutes,
  Default_Redirect_Path,
  publicRoutes,
} from '@/routes'

export const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return
  }

  if (isAuthRoute) {
    if (isLoggedIn)
      return Response.redirect(new URL(Default_Redirect_Path, nextUrl))
    return
  }

  if (!isLoggedIn && !isPublicRoute)
    return Response.redirect(new URL('/auth', nextUrl))

  return
})

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*|auth).*)',
  ],
}
