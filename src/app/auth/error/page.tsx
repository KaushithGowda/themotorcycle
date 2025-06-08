import CardWrapper from "@/components/auth/card-wrapper";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
    return (<CardWrapper headerLabel="Oops!" backBtnHref="/auth/login" backBtnLabel="Try again!" headerTitle="🔐 next-auth">
        <div className="flex justify-center items-center">
            <FaExclamationTriangle  size={50} color="red"/>
        </div>
    </CardWrapper>)
}

export default ErrorPage;