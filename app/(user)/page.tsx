import { FiPlus } from "react-icons/fi";
import { getUser } from "../lib/auth";
import AddTaskButton from "../components/ui/AddTaskButton";

export default async function Home() {
    const user = await getUser();

    return (
        <div className="h-full flex flex-col">


            <div className="text-2xl font-semibold">
                Welcome back, {user.firstName} {user.lastName}
            </div>


             <div className="flex-1 flex items-center justify-center">
                <AddTaskButton />
            </div>

        </div>
    );
}
