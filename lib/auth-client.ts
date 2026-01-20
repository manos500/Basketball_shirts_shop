import { createAuthClient } from "better-auth/react";
import {inferAdditionalFields, adminClient} from "better-auth/client/plugins";
import type { auth } from "@/lib/auth"
import { roles, ac } from "./permissions";


const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_UR,
    plugins: [inferAdditionalFields<typeof auth>(), adminClient({ ac, roles })],
});

export const { signUp, signOut, signIn, useSession, sendVerificationEmail, forgetPassword, resetPassword, admin } = authClient;
