import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative w-full h-screen bg-[#FF6767] flex items-center justify-center overflow-hidden">
            <img
                src="/images/bg.png"
                alt="bg-pattern"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />

            <div className="relative z-10 h-auto w-[70%] bg-white rounded-lg shadow-lg flex p-6">

                {children}

            </div>
        </div>
    );
}