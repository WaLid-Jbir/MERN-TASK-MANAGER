"use client";
import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";
import React from "react";

interface Props {
  params: Promise<{
    resetToken: string;
  }>;
}

const Page = ({ params }: Props) => {
  const resolvedParams = React.use(params); // Unwrap the promise
  const { resetToken } = resolvedParams;

  return (
    <main className="auth-page flex flex-col justify-center items-center">
      <ResetPasswordForm resetToken={resetToken} />
    </main>
  );
};

export default Page;