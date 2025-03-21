import axios from "axios";
import React, { createContext, useEffect } from "react";
import { useUserContext } from "./userContext";

const TasksContext = createContext();

const serverURL = "http://localhost:8000/api/v1";

export const TasksProvider = ({ children }) => {

    const userId = useUserContext().user._id;

    const [tasks, setTasks] = React.useState([]);
    const [task, setTask] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const [priority, setPriority] = React.useState("all");

    // get all tasks
    const getTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverURL}/tasks`);
            setTasks(response.data.tasks);
            setLoading(false);
        } catch (error) {
            console.log("Error getting tasks", error);
            setLoading(false);
        }
    }

    // get a task
    const getTask = async (taskId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverURL}/task/${taskId}`);
            setTasks(response.data);
            setLoading(false);
        } catch (error) {
            console.log("Error getting task", error);
            setLoading(false);
        }
    }

    // create a task
    const createTask = async (task) => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverURL}/task/create`, task);
            setTasks(...tasks, res.data);
        }
        catch (error) {
            console.log("Error creating task", error);
            setLoading(false);
        }
    }

    // update a task
    const updateTask = async (task) => {
        setLoading(true);
        try {
            const res = await axios.patch(`${serverURL}/task/${task._id}`, task);

            // update the task in the tasks array
            const newTasks = tasks.map((tsk) => {
                return tsk._id === res.data._id ? res.data : tsk;
            });
            setTasks(newTasks);
            setLoading(false);
        }
        catch (error) {
            console.log("Error updating task", error);
            setLoading(false);
        }
    }

    // delete a task
    const deleteTask = async (taskId) => {
        setLoading(true);
        try {
            const res = await axios.delete(`${serverURL}/task/${taskId}`);

            // remove the task from the tasks array
            const newTasks = tasks.filter((tsk) => tsk._id !== taskId);
            setTasks(newTasks);
        }
        catch (error) {
            console.log("Error deleting task", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getTasks();
    }, [userId]);


    return (
        <TasksContext.Provider 
            value={
                {   
                    tasks,
                    task,
                    loading,
                    getTasks,
                    getTask,
                    createTask,
                    updateTask,
                    deleteTask,
                    priority,
                    setPriority
                }
            }>
            {children}
        </TasksContext.Provider>
    )
}

export const useTasks = () => {
    return React.useContext(TasksContext);
}