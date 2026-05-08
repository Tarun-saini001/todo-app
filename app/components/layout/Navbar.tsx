"use client";

import { useEffect, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { GrFormSearch } from "react-icons/gr";
import { IoIosNotificationsOutline } from "react-icons/io";

export default function Navbar({ user }: { user: any }) {
    const [today, setToday] = useState("");

    useEffect(() => {
        setToday(new Date().toLocaleDateString("en-US")); // or en-US
    }, []);

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white ">

            <div className="text-[#FF6767] text-2xl font-bold ">Dash<span className="text-black">board</span></div>

            <div className="flex justify-center items-center  gap-1 w-[30%]">
                <input
                    type="text"
                    placeholder="Search your task here..."
                    className="w-full cursor-pointer px-4 py-1 shadow rounded-lg  outline-none 
                   focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767] 
                   transition"
                />
                <span className="rounded h-9 w-9 cursor-pointer">
                    <GrFormSearch
                        className="  text-white h-full w-full rounded p-1 bg-[#FF6767] border "
                    />
                </span>

            </div>


            <div className="flex items-center gap-4">
                <span className="rounded h-8 w-8 cursor-pointer">
                    <IoIosNotificationsOutline
                        className="  text-white h-full w-full rounded p-1 bg-[#FF6767] border "
                    />
                </span>
                <span className="rounded h-8 w-8 cursor-pointer">
                    <CiCalendarDate
                        className="  text-white h-full w-full rounded p-1 bg-[#FF6767] border "
                    />
                </span>
                <span className="text-sm text-sky-500 font-semibold">{today}</span>
            </div>
        </div>
    );
}