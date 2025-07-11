'use client'

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: 'modal' | 'redirect',
    asChild?: boolean
}

export const LoginButton = ({ children, mode = 'redirect' }: LoginButtonProps) => {
    const router = useRouter();

    function onClick() {
        router.push('/auth')
    }

    if (mode === 'modal') return <></>

    return (
        <Button onClick={onClick} className="cursor-pointer">
            {children}
        </Button>
    )
}