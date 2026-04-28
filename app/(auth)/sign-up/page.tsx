import { registerUser } from "@/app/actions/auth.actions";
import RegisterForm from "@/app/components/register-form";
import Link from "next/link";


const Page = () => {
    return (
        <div className="relative w-full h-screen bg-[#FF6767] flex items-center justify-center overflow-hidden">
            <img
                src="./images/bg.png"
                alt="bg-pattern"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="relative z-10 h-auto p-5 flex justify-center items-center w-[70%] bg-white  rounded-lg shadow-lg">
                <div className="w-1/2 h-[70vh] flex items-center justify-center p-6">
                    <img
                        src="./images/R 2.png"
                        alt="register"
                        className="w-full  object-contain pt-10 pr-35"
                    />
                </div>
                <div className="w-1/2 p-8 h-auto flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-center mb-6">
                        Sign Up
                    </h2>

                    <RegisterForm/>

                    <p className="text-sm text-center mt-4">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-[#FF6767] cursor-pointer">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page