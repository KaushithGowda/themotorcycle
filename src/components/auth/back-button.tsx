import { useRouter } from "next/navigation"

interface BackButtonProps {
    label: string,
    href: string
}

const BackButton = ({ label, href }: BackButtonProps) => {
    const router = useRouter();

    return (<div onClick={() => router.push(href)} className="flex justify-center w-full text-center cursor-pointer">
        <span className="hover:text-purple-700 hover:underline hover:underline-offset-8">
            {label}
        </span>
    </div>)
}

export default BackButton