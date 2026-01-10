"use server"

import { headers } from "next/headers";
import {auth} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";

export async function deleteUserAction({userId}: {userId: string}) {
    const headersList = await headers();

    const session = await auth.api.getSession({
        headers: headersList,
    });

    if (!session) throw new Error("Unauthorized");
    if (session.user.role !== "ADMIN") throw new Error("Forbidden");

    try{
        await prisma.user.delete({
            where: {
                id: userId,
                role: "USER"
            },
        })

        if (session.user.id === userId) {
            await auth.api.signOut({
                headers: headersList,
            });
            redirect('/auth/sign-in');
        }
        revalidatePath('/admin/dashboard');
        return {error: null};
    }catch(error){
        if (isRedirectError(error)) {
            throw error;
        }
        if (error instanceof Error) {
            return {error: error.message};
        }
        return {error: "Internal Server Error"};
    }
}