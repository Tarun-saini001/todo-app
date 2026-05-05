// import { FiPlus } from "react-icons/fi";
// import { getUser } from "../lib/auth";
// import AddTaskButton from "../components/ui/AddTaskButton";

// export default async function Home() {
//     const user = await getUser();

//     return (
//         <div className="h-full flex flex-col">


//             <div className="text-2xl font-semibold">
//                 Welcome back, {user.firstName} {user.lastName}
//             </div>


//              <div className="flex-1 flex items-center justify-center">
//                 <AddTaskButton />
//             </div>

//         </div>
//     );
// }


import { getUser } from "../lib/auth";
import TaskCard from "../components/dashboard/TaskCard";
import StatsCard from "../components/dashboard/StatsCard";
import AddTaskButton from "../components/ui/AddTaskButton";
import { cookies } from "next/headers";
import { BiTask } from "react-icons/bi";

export default async function Home() {
    const cookieStore = await cookies();

    const user = await getUser();

    const res = await fetch("http://localhost:3000/api/dashboard", {
        cache: "no-store",
        headers: {
            cookie: cookieStore.toString(),
        },
    });
    console.log('res:----------- ', res);

    if (!res.ok) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-500">Failed to load dashboard</p>
            </div>
        );
    }

    const data = await res.json();
    console.log('data: dasgboard ', data);

    const {
        stats = { completed: 0, inProgress: 0, notStarted: 0 },
        pendingTasks = [],
        completedTasks = [],
    } = data || {};

    const isEmpty =
        pendingTasks.length === 0 && completedTasks.length === 0;

    return (
        <div className="h-full flex flex-col gap-6">

            <h2 className="text-2xl font-semibold text-gray-800">
                Welcome back, {user.firstName} {user.lastName}
            </h2>

            {isEmpty ? (
                <div className="flex flex-1 items-center justify-center">
                    <AddTaskButton />
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-6 flex-1">


                    <div className="col-span-2 bg-white p-4 rounded-2xl shadow-sm ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800 text-lg">To-Do</h3>
                            <AddTaskButton />
                        </div>

                        <div className="flex flex-col gap-4">
                            {pendingTasks.map((task: any) => (
                                <TaskCard key={task._id} task={task} />
                            ))}
                        </div>
                    </div>


                    <div className="flex flex-col gap-6">

                        <StatsCard
                            completed={stats.completed}
                            inProgress={stats.inProgress}
                            notStarted={stats.notStarted}
                        />

                        <div className="bg-white p-6 rounded-2xl shadow-sm ">
                            <h3 className="font-semibold mb-4 flex items-center gap-2"><BiTask /> Completed Task</h3>

                            <div className="flex flex-col gap-5">
                                {completedTasks.map((task: any) => (
                                    <TaskCard key={task._id} task={task} />
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}