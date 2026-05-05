import { getUser } from "../lib/auth";
import Sidebar from "@/app/components/layout/Sidebar";
import Navbar from "@/app/components/layout/Navbar";
import { redirect } from "next/navigation";
import AuthRefresher from "../lib/AuthRefresh";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const user = await getUser();


    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* <AuthRefresher /> */}

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