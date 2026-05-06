"use client";

import { useRouter } from "next/navigation";

export default function GoBackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="underline cursor-pointer  text-[#FF6767]"
        >
            Go Back
        </button>
    );
}