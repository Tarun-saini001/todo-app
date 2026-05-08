import { getUserTasks } from "@/app/lib/data/task";
import MyTasksClient from "./MyTaskClient";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const { search } = await searchParams;

    const tasks = await getUserTasks(search);

    return (
        <MyTasksClient
            initialTasks={tasks}
            emptyTitle={
                search
                    ? `No results for "${search}"`
                    : "No Tasks Yet"
            }
            emptyMessage={
                search
                    ? "Try searching with another keyword."
                    : "Start by creating your first task."
            }

            showAddButton={!search}
        />
    );
}