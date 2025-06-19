import { FaExclamationTriangle } from "react-icons/fa";

interface FormErrorProps {
    message?: string
}

const FormError = ({ message }: FormErrorProps) => {
    if(!message) return

    return (
        <div className="bg-destructive/15 rounded-md flex items-center gap-x-2 text-sm text-destructive p-2">
            <FaExclamationTriangle size={15} color="red" />
            <p>{message}</p>
        </div>
    )
}

export default FormError