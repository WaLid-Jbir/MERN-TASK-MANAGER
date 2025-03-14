"use client";

import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useUserRedirect";

export default function Home() {
  useRedirect("/login");
  const {logoutUser, user} = useUserContext();
  const {name, photo, isVerified, bio} = user;

  return (
    <main className="py-[2rem] mx-[10rem]">
      <header className="flex justify-between">
        <h1 className="text-[2rem] font-bold">
          Welcome, <span className="text-red-600">{name}</span>
        </h1>
        <div className="flex items-center gap-4">
          <img 
            className="w-[40px] h-[40px] rounded-full"
            src={photo} 
            alt="user_img" 
          />
          <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer"
              onClick={logoutUser}
            >
              Logout
          </button>
        </div>
      </header>
    </main>
  );
}
