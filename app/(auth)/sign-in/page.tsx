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

                    <form className="space-y-4">

                        {/* user name */}
                        <div className="relative">
                            <img
                                src="./icons/userName.png"
                                alt="user"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                            />
                            <input
                                type="text"
                                placeholder="Enter Username"
                                className="w-full h-10 border rounded-md pl-10 pr-3 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-[#FF6767]"
                            />
                        </div>

                        {/* password */}
                        <div className="relative">
                            <img
                                src="./icons/password.png"
                                alt="password"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                            />
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="w-full h-10 border rounded-md pl-10 pr-3 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-[#FF6767]"
                            />
                        </div>


                        <button
                            type="submit"
                            className="bg-[#FF6767] cursor-pointer text-white px-6 py-2 rounded-md hover:opacity-90 w-fit"
                        >
                            Login
                        </button>
                    </form>


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