import { useRouter } from 'next/navigation';
import React, {createContext, useEffect, useState, useContext} from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const userContext = React.createContext();

export const UserContextProvider = ({ children }) => {

    const serverUrl = 'http://localhost:8000';

    const router = useRouter();

    const [user, setUser] = useState({});
    const [userState, setUserState] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(true);

    // register user
    const registerUser = async (e) => {
        e.preventDefault();
        if(!userState.email.includes('@') || !userState.password || userState.password.length < 6) {
            toast.error('Please enter a valid email and password with at least 6 characters');
            return;
        }
        try {
            const res = await axios.post(`${serverUrl}/api/v1/register`, userState);
            console.log("User registered successfully", res.data);
            toast.success('You are registered successfully');
            //clear form
            setUserState({
                name: '',
                email: '',
                password: '',
            });
            router.push('/login');
        } catch (error) {
            console.log("Error while registering user", error);
            toast.error(error.response.data.message);
        }
    }

    // login user
    const loginUser = async (e) => {
        e.preventDefault();
        if(!userState.email.includes('@') || !userState.password || userState.password.length < 6) {
            toast.error('Please enter a valid email and password with at least 6 characters');
            return;
        }

        try {
            const res = await axios.post(`${serverUrl}/api/v1/login`, {
                email: userState.email,
                password: userState.password,
            },
            {
                withCredentials: true, // send cookies with the request
            });
            console.log("User logged in successfully", res.data);
            toast.success('You are logged in successfully');
            //clear form
            setUserState({
                name: '',
                email: '',
                password: '',
            });
            router.push('/');
        } catch (error) {
            console.log("Error while logging in user", error);
            toast.error(error.response.data.message);
        }
    }

    // get user logged in status
    const userLoginStatus = async () => {
        let loggedIn = false;
        try {
            const res = await axios.get(`${serverUrl}/api/v1/login-status`, {
                withCredentials: true, // send cookies with the request
            });
            // coerce the value to a boolean
            loggedIn = !!res.data;
            setLoading(false);

            if(!loggedIn) {
                router.push('/login');
            }
        }
        catch (error) {
            console.log("Error while getting user state", error);
        }
        console.log("User logged in status", loggedIn);

        return loggedIn;
    }

    // logout user
    const logoutUser = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/v1/logout`, {
                withCredentials: true, // send cookies with the request
            });
            console.log("User logged out successfully", res.data);
            toast.success('You are logged out successfully');
            router.push('/login');
        } catch (error) {
            console.log("Error while logging out user", error);
            toast.error(error.response.data.message);
        }
    }

    // dynamic form handler
    const handlerUserInput = (name) => (e) => {
        const value = e.target.value;
        setUserState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    useEffect(() => {
        userLoginStatus();
    }, []);

    return (
        <userContext.Provider 
            value={{
                registerUser,
                userState,
                handlerUserInput,
                loginUser,
                logoutUser,
            }}>
            {children}
        </userContext.Provider>
    )
};

export const useUserContext = () => {
    return useContext(userContext);
}

