import { getUserTasks } from "@/app/lib/data/task";
import MyTasksClient from "./MyTaskClient";

export default async function Page() {
    const tasks = await getUserTasks();

    return (
        <MyTasksClient
            initialTasks={tasks}
            emptyTitle="No Tasks Yet"
            emptyMessage="Start by creating your first task."
            showAddButton={true}
        />
    );
}