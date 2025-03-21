"use client"
import { useTasks } from "@/context/taskContext";
import useRedirect from "@/hooks/useUserRedirect";
import Filters from "./components/filters/Filters";
import TaskItem from "./components/task-item/TaskItem";
import { Task } from "@/utils/types";

export default function Home() {

  useRedirect('/login');

  const {tasks} = useTasks();

  return (
    <main className="m-6 h-full">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">All Tasks</h1>
        <Filters />
      </div>
      <div className="pb-[2rem] mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[1.5rem]">
        {tasks.map((task: Task, i: number) => (
          <TaskItem key={i} task={task} />
        ))}
      </div>
    </main>
  );
}
