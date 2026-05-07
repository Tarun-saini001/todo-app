import LoginForm from "@/app/components/auth/login.form";
import Link from "next/link";

const Login = () => {
    return (
        <>


            <div className="w-1/2 h-[70vh] flex flex-col justify-center px-10">
                <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

                <LoginForm />

                <p className="text-sm  mt-4">
                    Don't have an account?{" "}
                    <Link href="/sign-up" className="text-[#FF6767] cursor-pointer">
                        Sign Up
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

        </>
    );
};

export default Login;