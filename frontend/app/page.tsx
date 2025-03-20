"use client"
import { useTasks } from "@/context/taskContext";
import useRedirect from "@/hooks/useUserRedirect";

export default function Home() {

  useRedirect('/login');

  const {tasks} = useTasks();
  console.log(tasks);

  return (
    <div></div>
  );
}
