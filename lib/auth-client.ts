import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_UR
})

export const { signUp, signOut, signIn, useSession, sendVerificationEmail, forgetPassword, resetPassword} = authClient;