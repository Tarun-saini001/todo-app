"use client";

import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "../ui/LogoutButton";

export default function Sidebar({ user }: any) {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", path: "/" },
        { label: "Vital Task", path: "/vital-task" },
        { label: "My Task", path: "/my-task" },
        { label: "Profile", path: "/profile" }
    ];

    return (
        <aside className="w-64 bg-[#FF6767] text-white flex flex-col justify-between p-4">
            <div>
                <div className="flex flex-col items-center mb-6">

                    <img
                        src={user?.profilePic || "/todoprofile.png"}
                        alt="profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-md"
                    />

                    <h3 className="font-semibold mt-3 text-center">
                        {user?.firstName} {user?.lastName}
                    </h3>

                    <p className="text-sm opacity-80 text-center break-all">
                        {user?.email}
                    </p>
                </div>

                <nav className="space-y-3">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            label={item.label}
                            active={
                                item.path === "/"
                                    ? (pathname === "/" || pathname === "/add-task")
                                    : pathname.startsWith(item.path)
                            }
                            onClick={() => router.push(item.path)}
                        />
                    ))}
                </nav>
            </div>

            <LogoutButton />
        </aside>
    );
}

function SidebarItem({
    label,
    active,
    onClick,
}: {
    label: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer px-3 py-2 rounded-md transition ${active
                ? "bg-white text-[#FF6767] font-semibold"
                : "hover:bg-white hover:text-[#FF6767]"
                }`}
        >
            {label}
        </div>
    );
}