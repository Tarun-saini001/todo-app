import { getCurrentUser, getUser } from "../lib/auth";
import Sidebar from "@/app/components/layout/Sidebar";
import Navbar from "@/app/components/layout/Navbar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const user = await getCurrentUser();
    // console.log('user: ', user);

    // if (!user) {
    //     redirect("/sign-in");
    // }
    // console.log("reached");

    console.log("Fetching user..");

    //  const cookieStore = await cookies();

    // const res = await fetch("http://localhost:3000/api/auth/me", {
    //     cache: "no-store",
    //     headers: {
    //         cookie: cookieStore.toString(),
    //     },
    // });

    // console.log('res: ', res);
    // if (res.status === 401) {
    //     redirect("/sign-in");
    // }

    // const data = await res.json();
    // console.log('data: ', data);

    // const user = data.user;
    const user = await getUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">

            <Navbar user={user} />


            <div className="flex flex-1 overflow-hidden">
                <Sidebar user={user} />

                <main className="flex-1 p-6 overflow-hidden">
                    {children}
                </main>
            </div>

        </div>
    );
}