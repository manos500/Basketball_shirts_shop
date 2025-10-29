"use client"


import { resetPassword } from "@/lib/auth-client";
import Image from "next/image";
import {useRouter} from "next/navigation";
import { useState } from "react"

interface ResetPasswordFormProps {
    token: string
}

const ResetPassword = ({token}: ResetPasswordFormProps) => {
    const [showNewPassword, setShowNewPassword] = useState<Boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<Boolean>(false);
    const [hasNewPasswordValue, setHasNewPasswordValue] = useState<Boolean>(false);
    const [hasConfirmPasswordValue, setHasConfirmPasswordValue] = useState<Boolean>(false);
    const [isPending, setIsPending] = useState<Boolean>(false);
          const router = useRouter();
      
          const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget)
              const password = String(formData.get("password"))
              if(!password) {
                return alert(`Please enter your password`);
              }
              
              const confirmPassword = String(formData.get("ConfirmPassword"))
              if(password !== confirmPassword) {
                return alert(`Passwords do not match`);
              }
      
              await resetPassword({
                  newPassword: password,
                  token,
                  fetchOptions: {
                      onRequest: () => {
                          setIsPending(true)
                      },
                      onResponse: () => {
                          setIsPending(false)
                      },
                      onError: (err) => {
                          alert(err)
                      },
                      onSuccess: () => {
                          alert("Password Reset successfully!")
                          router.push("/sign-in")
                      }
                  }
              })
          }
  return (
    <form className='max-w-sm w-full space-y-4' onSubmit={handleSubmit}>
    <div className="space-y-1 text-start">
        <div className="flex justify-between items-center gap-2">
            <label htmlFor="password" className="text-caption text-dark-900">
            New Password
            </label>
        </div>
        <div className="relative">
            <input
            id="password"
            name="password"
            type={showNewPassword ? "text" : "password"}
            onChange={(e) => setHasNewPasswordValue(e.target.value !== "")}
            placeholder="Type your new password"
            className={`
                w-full rounded-xl bg-light-ultra-dark py-3 text-body text-black 
                focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                ${!hasNewPasswordValue ? "bg-[url('/password_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8" : "px-3"}
            `}
            
            minLength={8}
            required
            />
            <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 text-caption text-dark-700 cursor-pointer"
            onClick={() => setShowNewPassword((v) => !v)}
            aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
            {showNewPassword 
            ? <Image src="/hidePassword.png" alt="NextRide" width={25} height={25} priority></Image> 
            : <Image src="/showPassword.png" alt="NextRide" width={25} height={25} priority></Image> }
         </button>
        </div>
    </div>
    <div className="space-y-1 text-start">
        <div className="flex justify-between items-center gap-2">
            <label htmlFor="password" className="text-caption text-dark-900">
            Confirm Password
            </label>
        </div>
        <div className="relative">
            <input
            id="ConfirmPassword"
            name="ConfirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            onChange={(e) => setHasConfirmPasswordValue(e.target.value !== "")}
            placeholder="Confirm your new password"
            className={`
                w-full rounded-xl bg-light-ultra-dark py-3 text-body text-black 
                focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                ${!hasConfirmPasswordValue ? "bg-[url('/password_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8" : "px-3"}
            `}
            
            minLength={8}
            required
            />
            <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 text-caption text-dark-700 cursor-pointer"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
            {showConfirmPassword 
            ? <Image src="/hidePassword.png" alt="NextRide" width={25} height={25} priority></Image> 
            : <Image src="/showPassword.png" alt="NextRide" width={25} height={25} priority></Image> }
         </button>
        </div>
    </div>
    <button
            type="submit"
            disabled={isPending}
            className={`mt-2 w-full rounded-full bg-dark-dark px-6 py-3 text-body-medium text-light-100 hover:ring-1 hover:bg-dark-light cursor-pointer text-text-light ${isPending && "opacity-50 cursor-wait"}`}
          > 
            Reset Password
          </button>
    </form>
  )
}

export default ResetPassword