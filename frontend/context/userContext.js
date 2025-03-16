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
    const [loading, setLoading] = useState(false);

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

    // get user data
    const getUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/v1/user`, {
                withCredentials: true, // send cookies with the request
            });
            console.log("User data: =========> ", res.data);
            setUser((prevState) => {
                return {
                    ...prevState,
                    ...res.data.user,
                }
            });

            setLoading(false);
        }
        catch (error) {
            console.log("Error while getting user data", error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    // update user
    const updateUser = async (e, data) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
                withCredentials: true, // send cookies with the request
            });

            console.log("User updated successfully", res.data);

            // update user state
            setUser((prevState) => ({
                ...prevState,
                ...res.data,
            }));

            toast.success('User updated successfully');
            setLoading(false);
        }
        catch (error) {
            console.log("Error while updating user", error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    // email verification
    const emailVerification = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/v1/verify-email`, 
            {},
            {
                withCredentials: true, // send cookies with the request
            });
            console.log("Email verification sent successfully", res.data);
            toast.success("Verification email sent successfully");
            setLoading(false);
        }
        catch (error) {
            console.log("Error sending verification email", error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    // verify email/user
    const verifyUser = async (token) => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/v1/verify-user/${token}`,
            {
                withCredentials: true, // send cookies with the request
            });
            toast.success("User verified successfully");

            //refetch user details
            await getUser();

            setLoading(false);

            //redirect user to home page
            router.push('/');
        }
        catch (error) {
            console.log("Error verifying user", error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    // forgot password
    const forgotPasswordEmail = async (email) => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/v1/forgot-password`, 
                { 
                    email
                },
                {
                    withCredentials: true, // send cookies with the request
                }
            );
            console.log("Forgot password email sent successfully", res.data);
            toast.success("Forgot password email sent, please check your email");
            setLoading(false);
        }
        catch (error) {
            console.log("Error sending forgot password email", error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    // reset password
    const resetPassword = async (token, password) => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/v1/reset-password/${token}`,
                {
                    password,
                },
                {
                    withCredentials: true, // send cookies with the request
                }
            );
            console.log("Password reset successfully", res.data);
            toast.success("Password reset successfully");
            // redirect user to login page
            router.push('/login');
            setLoading(false);
        }
        catch (error) {
            console.log("Error resetting password", error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    // change password
    const changePassword = async (currentPassword, newPassword) => {
        setLoading(true);
        try {
            const res = await axios.patch(`${serverUrl}/api/v1/change-password`, 
                {
                    currentPassword, 
                    newPassword
                }, 
                {
                    withCredentials: true, // send cookies with the request
                }
            );
            console.log("Password changed successfully", res.data);
            toast.success("Password changed successfully");
            setLoading(false);
        }
        catch (error) {
            console.log("Error changing password", error);
            setLoading(false);
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
        const loginStatusGetUser = async () => {
          const isLoggedIn = await userLoginStatus();
    
          if (isLoggedIn) {
            await getUser();
          }
        };
    
        loginStatusGetUser();
    }, []);

    console.log("USER: ", user);

    return (
        <userContext.Provider 
            value={{
                registerUser,
                userState,
                handlerUserInput,
                loginUser,
                logoutUser,
                userLoginStatus,
                user,
                updateUser,
                emailVerification,
                verifyUser,
                forgotPasswordEmail,
                loading,
                resetPassword,
                changePassword
            }}>
            {children}
        </userContext.Provider>
    )
};

export const useUserContext = () => {
    return useContext(userContext);
}

