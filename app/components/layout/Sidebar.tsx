"use client";

import { logoutUser } from "@/app/actions/auth.actions";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

export default function Sidebar({ user }: any) {
    const router = useRouter();

    const handleLogout = async () => {
        await logoutUser();
        router.push("/sign-in");
    };

    return (
        <aside className="w-64 bg-[#FF6767] text-white flex flex-col justify-between p-4">
            <div>

                <div className="flex flex-col items-center mb-6">

                    <h3 className="font-semibold">
                        {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-sm opacity-80">{user?.email}</p>
                </div>


                <nav className="space-y-3">
                    <SidebarItem label="Dashboard" />
                    <SidebarItem label="Vital Task" />
                    <SidebarItem label="My Task" />
                    <SidebarItem label="Task Categories" />
                    <SidebarItem label="Settings" />
                    <SidebarItem label="Help" />
                </nav>
            </div>

            <form action={logoutUser}>
                <button
                    type="submit"
                    className="flex w-full px-3 py-2 rounded-md items-center font-semibold cursor-pointer gap-4 hover:bg-white hover:text-[#FF6767] transition"
                >
                    <FiLogOut />
                    Logout
                </button>
            </form>

        </aside>
    );
}

function SidebarItem({ label }: { label: string }) {
    return (
        <div className="cursor-pointer px-3 py-2 rounded-md hover:bg-white hover:text-[#FF6767] transition">
            {label}
        </div>
    );
}