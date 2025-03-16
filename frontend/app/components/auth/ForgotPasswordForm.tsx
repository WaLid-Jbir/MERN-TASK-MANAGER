"use client";
import { useUserContext } from '@/context/userContext';
import React from 'react'

const ForgotPasswordForm = () => {

    const {forgotPasswordEmail, loading} = useUserContext();

    const [email, setEmail] = React.useState("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await forgotPasswordEmail(email);
        // clear the input field
        setEmail("");
    }

  return (
    <form className="relative m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full">
    <div className="relative z-10">
      <h1 className="mb-2 text-center text-[1.35rem] font-medium">
        Enter email to reset password
      </h1>
      <div className="mt-[1rem] flex flex-col">
        <label htmlFor="email" className="mb-1 text-[#999]">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          name="email"
          placeholder="johndoe@gmail.com"
          className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
        />
      </div>
      <div className="flex">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors cursor-pointer"
        >
            {loading ? <i className='fa-solid fa-spinner animate-spin'></i> : "Reset Password"}
        </button>
      </div>
    </div>
    <img src="/flurry.png" alt="" />
  </form>
  )
}

export default ForgotPasswordForm
