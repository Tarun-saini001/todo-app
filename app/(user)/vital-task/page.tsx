import { getExtremeTasks } from "@/app/lib/data/task";
import MyTasksClient from "../my-task/MyTaskClient";

export default async function Page() {
    const tasks = await getExtremeTasks();

     return (
        <MyTasksClient
            initialTasks={tasks}
            emptyTitle="No Vital Tasks"
            emptyMessage="You don’t have any high priority tasks right now."
        />
    );
}