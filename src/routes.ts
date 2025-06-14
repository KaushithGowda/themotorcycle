/**
 * Array of routes accessible to public
 * These routes do not require aunthentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
    '/'
]

/**
 * Array of routes used for aunthentication
 * These routes will redirect logged in users to /settings page
 * @type {string[]}
 */
export const authRoutes: string[] = [
    '/auth',
    '/auth/error'
]

/**
 * The prefix for api aunthentication routes
 * Routes that start with this prefix are used for API
 * authentication purposes
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth'

/**
 * Default redirect path after login 
 * @type {string}
 */
export const Default_Redirect_Path: string = '/'