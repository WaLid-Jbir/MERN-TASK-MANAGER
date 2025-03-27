import moment from "moment";
import { Task } from "./types";

export const formatTime = (createdAt: string) => {
  const now = moment();
  const created = moment(createdAt);

  if (created.isSame(now, "day")) {
    return 'Today';
  }

  // if the task was created yesterday
  if(created.isSame(now.subtract(1, 'day'), "day")) {
    return 'Yesterday';
  }

  // check if created within the  last 7 days
  if(created.isSameOrAfter(now.subtract(6, 'days'), "day")) {
    return created.fromNow();
  }

  // if created within the last 3 weeks
  if (created.isAfter(moment().subtract(3, 'weeks'), "week")) {
    return created.fromNow();
  }

  // if created more than 7 days ago
  return created.format("DD/MM/YYYY");

}

export const filteredTasks = (tasks: Task[], priority: string) => {
  const filteredTasks = () => {
    switch (priority) {
      case "low":
        return tasks.filter((task) => task.priority === "low");
      case "medium":
        return tasks.filter((task) => task.priority === "medium");
      case "high":
        return tasks.filter((task) => task.priority === "high");
      default:
        return tasks;
    }
  }
  return filteredTasks();
}

export const overdueTasks = (tasks: Task[]) => {
  const todayDate = moment();

  // filter tasks that are not completed and have a due date that is before today
  return tasks.filter((task) => {
    return  !task.completed && moment(task.dueDate).isBefore(todayDate);
  })

}