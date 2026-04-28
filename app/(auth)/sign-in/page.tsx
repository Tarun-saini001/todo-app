import LoginForm from "@/app/components/login.form";
import Link from "next/link";

const Login = () => {
    return (
        <div className="relative w-full h-screen bg-[#FF6767] flex items-center justify-center overflow-hidden">

            <img
                src="./images/bg.png"
                alt="bg image"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />


            <div className="relative h-auto z-10 w-[70%] bg-white rounded-lg shadow-lg flex p-6">

                {/* form*/}
                <div className="w-1/2 h-[70vh] flex flex-col justify-center px-10">
                    <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

                    <LoginForm/>


                    <p className="text-sm  mt-4">
                        Don't have an account?{" "}
                            <Link href="/sign-up" className="text-[#FF6767] cursor-pointer">
                                Create One
                            </Link>
                    </p>
                </div>


                <div className="w-1/2 flex h-[70vh] items-center justify-center">
                    <img
                        src="./images/login.png"
                        alt="login illustration"
                        className="w-full h-[60vh] object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;