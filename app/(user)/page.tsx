import { redirect } from "next/navigation";

export default async function Home() {
    // const res = await fetch("http://localhost:3000/api/auth/me", {
    //     cache: "no-store",
    //     credentials: "include",
    // });

    // if (res.status === 401) {
    //     redirect("/sign-in");
    // }

    // const data = await res.json();

    // if (!data.success) {
    //     redirect("/sign-in");
    // }

    return <div>Welcome</div>;
}