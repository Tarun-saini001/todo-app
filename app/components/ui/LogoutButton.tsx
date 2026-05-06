"use client";

import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { logoutUser } from "@/app/actions/auth.actions";

export default function LogoutButton() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
           
            <button
                onClick={() => setShowModal(true)}
                className="flex w-full px-3 py-2 rounded-md items-center font-semibold cursor-pointer gap-4 hover:bg-white hover:text-[#FF6767] transition"
            >
                <FiLogOut />
                Logout
            </button>

            
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
                        <h2 className="text-lg text-black font-semibold mb-3">
                            Confirm Logout
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to logout?
                        </p>

                        <div className="flex justify-center items-center gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                 className="px-4 py-2 border text-black cursor-pointer rounded-md"
                            >
                                Cancel
                            </button>

                           
                            <form action={logoutUser}>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-[#FF6767] text-white cursor-pointer"
                                >
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}