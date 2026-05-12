"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { GrFormSearch } from "react-icons/gr";
import { IoIosNotificationsOutline } from "react-icons/io";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Navbar({ user }: { user: any }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState("");
    const [today, setToday] = useState("");
    const [dayName, setDayName] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);

    const [selectedDate, setSelectedDate] = useState<Date>(
        new Date()
    );
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const now = new Date();


        setDayName(
            now.toLocaleDateString("en-US", {
                weekday: "long",
            })
        );


        const formattedDate = now.toLocaleDateString("en-GB");

        setToday(formattedDate);
    }, []);

    useEffect(() => {

        function handleClickOutside(event: MouseEvent) {

            if (
                calendarRef.current &&
                !calendarRef.current.contains(
                    event.target as Node
                )
            ) {
                setShowCalendar(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    useEffect(() => {

        if (pathname === "/my-task") {
            setSearch(searchParams.get("search") || "");
        } else {
            setSearch("");
        }

    }, [pathname, searchParams]);
    const handleSearch = () => {

        if (!search.trim()) {
            router.push("/my-task");
            return;
        }

        router.push(
            `/my-task?search=${encodeURIComponent(search)}`
        );
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white ">

            <div className="text-[#FF6767] text-2xl font-bold ">Dash<span className="text-black">board</span></div>

            <div className="flex justify-center items-center w-[40%]">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        placeholder="Search your task here..."
                        className="w-full px-4 pr-14 py-2 shadow rounded-lg outline-none
            focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767]
            transition"
                    />

                    <button
                        onClick={handleSearch}
                        className="absolute top-0 right-0 h-full w-12"
                    >
                        <GrFormSearch
                            className="text-white h-full w-full p-1 bg-[#FF6767]
                rounded-lg"
                        />
                    </button>
                </div>
            </div>


            <div className="flex items-center gap-4">
                {/* <span className="rounded h-8 w-8 cursor-pointer">
                    <IoIosNotificationsOutline
                        className="  text-white h-full w-full rounded p-1 bg-[#FF6767] border "
                    />
                </span> */}

                {/* <span className="rounded h-8 w-8 cursor-pointer">
                    <CiCalendarDate
                        className="  text-white h-full w-full rounded p-1 bg-[#FF6767] border "
                    />
                            </span> */}
                    <button
                        onClick={() =>
                            setShowCalendar(!showCalendar)
                        }
                        className="rounded h-8 w-8 cursor-pointer"
                    >
                        <CiCalendarDate
                            className="text-white h-full w-full rounded
                        p-1 bg-[#FF6767] border"
                        />
                    </button>
                <div className="flex flex-col leading-tight">
                    <span className="text-sm text-black font-semibold ">
                        {dayName}
                    </span>
                    <span className="text-sm text-sky-500 font-semibold">
                        {today}
                    </span>
                    {showCalendar && (

                        <div
                            ref={calendarRef}
                            className="absolute top-14 right-0 z-50
                        bg-white shadow-2xl rounded-2xl p-4"
                        >

                            <Calendar
                                onChange={(value) =>
                                    setSelectedDate(
                                        value as Date
                                    )
                                }
                                value={selectedDate}
                            />

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}