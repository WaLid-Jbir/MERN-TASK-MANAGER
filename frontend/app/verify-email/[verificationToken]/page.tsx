"use client";
import { useUserContext } from '@/context/userContext';
import React from 'react';

interface Props {
  params: Promise<{
    verificationToken: string;
  }>;
}

const Page = ({ params }: Props) => {
  const unwrappedParams = React.use(params); // Unwrap params
  const { verificationToken } = unwrappedParams;

  const { verifyUser } = useUserContext();

  return (
    <div className='auth-page flex flex-col justify-center items-center'>
      <div className='bg-white flex flex-col justify-center gap-[1rem] px-[3rem] py-[2rem] rounded-md'>
        <h1 className='text-[#999] text-[2rem]'>Verify your account</h1>
        <button
          className='self-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer'
          onClick={() => verifyUser(verificationToken)}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default Page;