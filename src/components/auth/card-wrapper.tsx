'use client'

import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import Header from "@/components/auth/header";
import Social from "@/components/auth/social";
import BackButton from "@/components/auth/back-button";

interface CardWrapperProps {
    children?: React.ReactNode,
    headerTitle: string,
    headerLabel: string,
    backBtnHref?: string,
    backBtnLabel?: string,
    showSocial?: boolean,
}

const CardWrapper = ({ children, headerLabel, headerTitle, showSocial, backBtnHref, backBtnLabel }: CardWrapperProps) => {
    return (<Card className="shadow-md w-[400px]">
        <CardHeader>
            <Header title={headerTitle} label={headerLabel} />
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
        {showSocial &&
            <CardFooter>
                <Social />
            </CardFooter>
        }
        {
            (backBtnLabel && backBtnHref) &&
            <CardFooter>
                <BackButton label={backBtnLabel} href={backBtnHref} />
            </CardFooter>
        }
    </Card>)
}

export default CardWrapper