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
        { label: "Profile", path: "/profile" },
    ];

    return (
        <aside className="w-65 flex flex-col">

            
            <div className="h-14 bg-gray-100 shrink-0" />

           
            <div className="flex-1 bg-[#FF6767] rounded-tr-3xl relative px-5 pb-5 pt-14 flex flex-col justify-between">

                
                <div>

                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">

                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">

                            <img
                                src={user?.profilePic || "/todoprofile.png"}
                                alt="profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="mt-8 text-center text-white">

                        <h3 className="font-semibold text-lg">
                            {user?.firstName} {user?.lastName}
                        </h3>

                        <p className="text-sm opacity-90 break-all">
                            {user?.email}
                        </p>
                    </div>

                
                    <nav className="mt-8 space-y-3">

                        {navItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                label={item.label}
                                active={
                                    item.path === "/"
                                        ? pathname === "/" || pathname === "/add-task"
                                        : pathname.startsWith(item.path)
                                }
                                onClick={() => router.push(item.path)}
                            />
                        ))}
                    </nav>
                </div>

               
               <span className="text-white"><LogoutButton /></span> 
            </div>
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
            className={`cursor-pointer px-4 py-3 rounded-xl transition text-base
            ${
                active
                    ? "bg-white text-[#FF6767] font-semibold shadow-sm"
                    : "text-white hover:bg-white hover:text-[#FF6767]"
            }`}
        >
            {label}
        </div>
    );
}