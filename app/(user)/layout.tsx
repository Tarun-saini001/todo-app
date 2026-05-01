import { getCurrentUser } from "../lib/auth";
import Sidebar from "@/app/components/layout/Sidebar";
import Navbar from "@/app/components/layout/Navbar";
import { redirect } from "next/navigation";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    console.log('user: ', user);

    if (!user) {
        redirect("/sign-in"); 
    }
    console.log("reached");

    return (
        <div className="flex flex-col h-screen bg-gray-100">

            <Navbar user={user} />


            <div className="flex flex-1 overflow-hidden">
                <Sidebar user={user} />

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}