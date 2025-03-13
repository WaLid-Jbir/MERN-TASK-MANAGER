"use client";
import { useUserContext } from '@/context/userContext';
import React from 'react'

const LoginForm = () => {

    const {loginUser, userState, handlerUserInput} = useUserContext();
    const {email, password} = userState;
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

  return (
    <form className='relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]'>
        <div className='relative z-10'>
            <h1 className='mb-2 text-center text-[1.35rem] font-medium'>
                {" "}
                Login to your account
            </h1>
            <p className='mb-8 px-[2rem] text-center text-[#999] text-[14px]'>
                Login Now. Don't have an account?{" "}
                <a 
                    href="/register" 
                    className='font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300'
                >
                    Register here
                </a>
            </p>
            <div className='flex flex-col mt-[1rem]'>
                <label htmlFor="email" className='mb-1 text-[#999]'>
                    Email
                </label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => handlerUserInput("email")(e)}
                    placeholder='johndoe@gmail.com' 
                    className='px-4 py-3 border-[2px] border-gray-500 rounded-md outline-[#2ECC71] text-gray-800' 
                />
            </div>
            <div className='relative mt-[1rem] flex flex-col'>
                <label htmlFor="password" className='mb-1 text-[#999]'>
                    Password
                </label>
                <input 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => handlerUserInput("password")(e)}
                    placeholder='***************' 
                    className='px-4 py-3 border-[2px] border-gray-500 rounded-md outline-[#2ECC71] text-gray-800' 
                />
                <button type="button" className='absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45 cursor-pointer' >
                    {
                        showPassword ? (
                            <i className="fa-solid fa-eye-slash" onClick={togglePassword}></i>
                        ) : (
                            <i className="fa-solid fa-eye" onClick={togglePassword}></i>
                        )
                    }
                </button>
            </div>
            <div className='mt-4 flex justify-end'>
                <a href="/forgot-password" className='font-bold text-[#2ECC71] text-[14px] hover:text-[#7263F3] transition-all duration-300'>
                    Forgot password?
                </a>
            </div>
            <div className="flex">
                <button 
                    type='submit' 
                    disabled={ !email || !password}
                    className='mt-[1.5rem] flex-1 px-4 py-3 rounded-md bg-[#2ECC71] text-white font-medium cursor-pointer'
                    onClick={loginUser}
                >
                    Login Now
                </button>
            </div>
        </div>
    </form>
  )
}

export default LoginForm;
