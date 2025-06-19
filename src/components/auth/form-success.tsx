import { FaRegCheckCircle } from "react-icons/fa";

interface FormSuccessProps {
  message?: string
}

const FormSuccess = ({ message }: FormSuccessProps) => {
  if(!message) return
  return (
    <div className="bg-emerald-500/15 rounded-md flex items-center gap-x-2 text-sm text-emerald-500 p-2">
      <FaRegCheckCircle size={15} color="text-emerald-500" />
      <p>{message}</p>
    </div>
  )
}

export default FormSuccess