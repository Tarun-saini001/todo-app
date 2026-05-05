"use client";

import { useEffect } from "react";

export default function AuthRefresher() {
    useEffect(() => {
        console.log("refreshing..");
        fetch("http://localhost:3000/api/auth/me", {
            method: "GET",
            credentials: "include",
        });
        console.log("refreshed");
    }, []);

    return null;
}