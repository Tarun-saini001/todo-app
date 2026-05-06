import { getExtremeTasks } from "@/app/lib/data/task";
import MyTasksClient from "../my-task/MyTaskClient";

export default async function Page() {
    const tasks = await getExtremeTasks();

    return <MyTasksClient initialTasks={tasks} />;
}