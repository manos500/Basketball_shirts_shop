"use client"

import { useState} from "react";
import Image from "next/image";
import { SocialProviders } from "./SocialProviders";
import {useRouter} from "next/navigation";
import { HandleAuthAction } from "@/lib/actions/authActions";
import Link from "next/link"


type Props = {
    mode: "sign-in" | "sign-up";
}

const AuthForm = ({mode}: Props) => {
    const [isPending, setIsPending] = useState(false);
    const [show, setShow] = useState(false);
    const [hasFullNameValue, setHasFullNameValue] = useState(false);
    const [hasEmailValue, setHasEmailValue] = useState(false);
    const [hasPasswordValue, setHasPasswordValue] = useState(false);
    const router = useRouter();


   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await HandleAuthAction(formData, mode);

    if (result.success) {
      console.log(`User ${mode === "sign-up" ? "registered" : "signed in"} successfully`);
      if (result.redirect) router.push(result.redirect);
    } else if (result.redirect) {
      router.push(result.redirect);
    }
      else {
      alert(`Error: ${result.error}`);
      
    }

    setIsPending(false);
  };


    
  return (
    <div className="space-y-6 flex justify-center">
         <div className="w-full md:[70vw] max-w-md bg-light-light rounded-lg p-8 shadow-shadow-m text-center">
            <h1 className="text-heading-3 text-dark-900 mb-4">
                {mode === "sign-in" ? "Welcome Back!" : "Join CourtStyle Today!"}
            </h1>
            <p className="mb-2 text-body text-muted-foreground">
                {mode === "sign-in"
            ? "Sign in to continue your journey"
            : "Create your account to start your fitness journey"}
            </p>
         

         <SocialProviders variant={mode} setIsPending={setIsPending}/>

         <div className="">
            <span className="shrink-0 text-caption text-muted-foreground">
                Or {mode === "sign-in" ? "sign in" : "sign up"} with
            </span>
         </div>

         <form className="space-y-6" onSubmit={handleSubmit}>
          {mode === "sign-up" && (
            <div className="space-y-1 text-start">
              <label htmlFor="fullname" className="text-caption text-dark-900">
              Full Name
              </label>
              <input
                id="fullname"
                onChange={(e) => setHasFullNameValue(e.target.value !== "")}
                name="fullname"
                type="text"
                placeholder="Type your full name"
                className={`
                  w-full rounded-xl bg-light py-3 text-body text-black 
                  focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                  ${!hasFullNameValue ? "bg-[url('/fullName_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8" : "px-3"}
                `}
              />
            </div>
          )}
          
          <div className="space-y-1 text-start">
            <label htmlFor="email" className="text-caption text-dark-900">
                Email
            </label>
            <input
              id="email"
              onChange={(e) => setHasEmailValue(e.target.value !== "")}
              name="email"
              type="email"
              placeholder="Type your email"
              className={`
                w-full rounded-xl bg-light  py-3 text-body text-black 
                focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                ${!hasEmailValue ? "bg-[url('/email_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8": "px-3"}
              `}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1 text-start">
            <div className="flex justify-between items-center gap-2">
              <label htmlFor="password" className="text-caption text-dark-900">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-sm italic text-muted-foreground hover:text-foreground">Forgot password?</Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                onChange={(e) => setHasPasswordValue(e.target.value !== "")}
                placeholder="Type your password"
                className={`
                  w-full rounded-xl bg-light py-3 text-body text-black 
                  focus:outline-none focus:ring-1 focus:ring-offset-neutral-400 focus:bg-light
                  ${!hasPasswordValue ? "bg-[url('/password_placeholder.png')] bg-no-repeat bg-[length:18px_18px] bg-[position:8px_center] px-8" : "px-3"}
                `}
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                minLength={8}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 text-caption text-dark-700 cursor-pointer"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show 
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
          {isPending ? (
            <div className="flex justify-center items-center gap-2">
              <div className="loader_circle" />
            </div> 
          ) : (
            (mode === "sign-in") ? "Sign In" : "Sign Up"
          )
          }
          
        </button>

          {mode === "sign-up" && (
          <p className="text-center text-footnote text-dark-700">
            By signing up, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
          </p>
        )}

        {mode === "sign-in" && (
          <p className="text-center text-footnote text-text-dark-muted">
            New here?
            <a href="sign-up" className="ml-1 underline text-foreground hover:text-muted-foreground">Create an account</a>
          </p>
          
        )}
         </form>
       

      </div>
    </div>
  )
}

export default AuthForm