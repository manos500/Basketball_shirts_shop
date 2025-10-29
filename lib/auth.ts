import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmailAction } from "@/actions/send-email.action";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {    
        enabled: true,
        minPasswordLength: 8,
        requireEmailVerification: true,
        sendResetPassword: async ({user, url}) => {
          await sendEmailAction({
          to: user.email,
          subject: "Reset Your Password",
          meta: {
            description: "Please click the link below to reset your password",
            link: url
          }
        })
        }
    }, 
    emailVerification: {
      sendOnSignUp: true,
      expiresIn: 60 * 60,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({user, url}) => {
        const link = new URL(url);
        link.searchParams.set("callbackURL", "/auth/verify")
        await sendEmailAction({
          to: user.email,
          subject: "Verify your email address",
          meta: {
            description: "Please verify your email address to complete registration",
            link: String(link)
          }
        })
      }
    },
    providers: {
      email: true,
    },
    socialProviders: {
    google: {
      prompt: "select_account", 
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    },
  },
    plugins: [nextCookies()],
});
