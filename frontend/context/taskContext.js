import axios from "axios";
import React, { createContext, useEffect } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverURL = "http://localhost:8000/api/v1";

export const TasksProvider = ({ children }) => {

    const userId = useUserContext().user._id;

    const [tasks, setTasks] = React.useState([]);
    const [task, setTask] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const [isEditing, setIsEditing] = React.useState(false);
    const [priority, setPriority] = React.useState("all");
    const [activeTask, setActiveTask] = React.useState(null);
    const [modalMode, setModalMode] = React.useState("");
    const [profileModal, setProfileModal] = React.useState(false);

    const openModalForAdd = () => {
        setModalMode("add");
        setIsEditing(true);
        setTask({});
    }

    const openProfileModal = () => {
        setProfileModal(true);
    }
    
    const openModalForEdit = (task) => {
        setModalMode("edit");
        setIsEditing(true);
        setActiveTask(task);
    }

    const closeModal = () => {
        setIsEditing(false);
        setProfileModal(false);
        setModalMode("");
        setActiveTask(null);
        setTask({});
    }

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
            setTask(response.data);
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
            setTasks([...tasks, res.data]);
            toast.success("Task created successfully");
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
            toast.success("Task updated successfully");
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

    const handleInput = (name) => (e) => {
        if (name === "setTask") {
            setTask(e);
        }
        else{
            setTask({...task, [name]: e.target.value});
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
                    setPriority,
                    handleInput,
                    isEditing,
                    openModalForAdd,
                    openModalForEdit,
                    activeTask,
                    closeModal,
                    modalMode,
                }
            }>
            {children}
        </TasksContext.Provider>
    )
}

export const useTasks = () => {
    return React.useContext(TasksContext);
}