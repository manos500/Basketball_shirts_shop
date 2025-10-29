import { redirect } from "next/navigation";
import React from 'react'
import ResetPassword from "@/components/ResetPassword";

interface PageProps {
    searchParams: Promise<{token: string}>
}
const page = async ({searchParams}: PageProps) => {
  const token = (await searchParams).token;

  if (!token) redirect("/auth/sign-in")
  return (
    <div className=" flex justify-center items-center h-[70vh]">
         <div className="w-[70vw] max-w-md bg-light-light  rounded-lg p-8 shadow-shadow-m text-center space-y-4">
        <h1 className='text-heading-3'>Reset Password</h1>
        <p className='text-muted-foreground'>
           Please enter your new password!
        </p>
      <ResetPassword token={token}/>
    </div>
    </div>
  )
}

export default page