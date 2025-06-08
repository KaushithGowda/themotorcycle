"use client"
import { Default_Redirect_Path } from "@/routes";

import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { signIn } from "next-auth/react";

const Social = () => {

    const onClickGoogle = async (provider: 'google' | 'github') => {
        await signIn(provider,{
            redirectTo: Default_Redirect_Path
        })
    }

    return (
        <div className="flex justify-center items-center w-full gap-x-2">
            <Button variant={'outline'} size={'lg'} className="w-1/2 cursor-pointer" onClick={() => onClickGoogle('google')}>
                <FcGoogle className="h-5 w-5" />
            </Button>
            <Button variant={'outline'} size={'lg'} className="w-1/2 cursor-pointer" onClick={() => onClickGoogle('github')}>
                <FaGithub className="h-5 w-5" />
            </Button>
        </div>
    )
}

export default Social