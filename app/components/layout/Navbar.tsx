"use client";

import { Bell, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar({ user }: { user: any }) {
    const [today, setToday] = useState("");

    useEffect(() => {
        setToday(new Date().toLocaleDateString("en-US")); // or en-US
    }, []);

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white shadow">

            <div className="text-[#FF6767] text-2xl font-bold ">Dash<span className="text-black">board</span></div>

            <input
                type="text"
                placeholder="Search your task here..."
                className="w-1/3 px-4 py-2 shadow rounded-lg"
            />


            <div className="flex items-center gap-4">
                <Bell className="cursor-pointer" />
                <Calendar className="cursor-pointer" />
                <span className="text-sm text-gray-500">{today}</span>
            </div>
        </div>
    );
}