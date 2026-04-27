
const Page = () => {
    return (
        <div className="relative w-full h-screen bg-[#FF6767] flex items-center justify-center overflow-hidden">
            <img
                src="./images/bg.png"
                alt="bg-pattern"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="relative z-10 h-auto p-5 flex justify-center items-center w-[70%] bg-white  rounded-lg shadow-lg">
                <div className="w-1/2 flex items-center justify-center p-6">
                    <img
                        src="./images/R 2.png"
                        alt="register"
                        className="w-full h-[70vh] object-contain pt-10 pr-35"
                    />
                </div>
                <div className="w-1/2 p-8 h-[70vh] flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-center mb-6">
                        Sign Up
                    </h2>

                    <form className="space-y-4">

                        <div className="relative">
                            <img
                                src="./icons/firstName.png"
                                alt="first name icon"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                            />
                            <input
                                type="text"
                                placeholder="Enter First Name"
                                className="w-full border rounded-md p-2 pl-10 outline-none focus:ring-2 focus:ring-[#FF6767]"
                            />
                        </div>

                        <div className="relative">
                            <img
                                src="./icons/lastName.png"
                                alt="last name icon"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                            />
                            <input
                                type="text"
                                placeholder="Enter Last Name"
                                className="w-full border rounded-md p-2 pl-10  outline-none focus:ring-2 focus:ring-[#FF6767]"
                            />
                        </div>


                        <div className="relative">
                            <img
                                src="./icons/userName.png"
                                alt="user name icon"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                            />
                            <input
                                type="text"
                                placeholder="Enter Username"
                                className="w-full border rounded-md p-2 pl-10 outline-none focus:ring-2 focus:ring-[#FF6767]"
                            />
                        </div>

                        <div className="relative">
                            <img
                                src="./icons/email.png"
                                alt="email icon"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                            />
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="w-full border pl-10 rounded-md p-2 outline-none focus:ring-2 focus:ring-[#FF6767]"
                            />
                        </div>

                        <div className="relative">
                            <img
                                src="./icons/password.png"
                                alt="password icon"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                            />
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="w-full border pl-10 rounded-md p-2 outline-none focus:ring-2 focus:ring-[#FF6767]"
                            />
                        </div>


                        <div className="relative">
                            <img
                                src="./icons/confirmPass.png"
                                alt="confirm passwor icon"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full pl-10 border rounded-md p-2 outline-none focus:ring-2 focus:ring-[#FF6767]"
                            />
                        </div>


                        <div className="flex items-center gap-2 text-sm">
                            <input type="checkbox" />
                            <span>I agree to all terms</span>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#FF6767] text-white py-2 rounded-md hover:opacity-90"
                        >
                            Register
                        </button>
                    </form>

                    <p className="text-sm text-center mt-4">
                        Already have an account?{" "}
                        <span className="text-[#FF6767] cursor-pointer">Sign In</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page