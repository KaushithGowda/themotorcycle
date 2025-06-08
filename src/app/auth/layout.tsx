const AuthLayout = ({children}: {children : React.ReactNode }) => {
    return (
        <div className="flex justify-center items-center h-full w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white ">{children}</div>
    )
}

export default AuthLayout;