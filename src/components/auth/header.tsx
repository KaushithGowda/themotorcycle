import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"

const fonts = Poppins({
    weight: '600',
    subsets: ['latin']
})

interface HeaderProps {
    label: string,
    title: string,
}

const Header = ({label, title}: HeaderProps) => {
    return (
        <div className="flex flex-col items-center gap-y-1">
            <span className={cn("text-5xl font-semibold drop-shadow-2xl capitalize", fonts.className)}>
                {title}
            </span>
            <p className="capitalize text-md">{label}</p>
        </div>
    )
}

export default Header