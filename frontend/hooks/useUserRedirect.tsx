"use client";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useRedirect = (redirect: string) => {
  const router = useRouter();
  const {user} = useUserContext();

  useEffect(() => {
    if (!user || !user.email) {
      router.push(redirect);
    }
    // watch for changes to user, redirect, router
  }, [user, redirect, router]);
};

export default useRedirect;