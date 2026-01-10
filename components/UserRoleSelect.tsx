"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/generated/prisma";
import { admin } from "@/lib/auth-client";

interface UserRoleSelectProps {
    userId: string;
    role: string;
}

const UserRoleSelect = ({userId, role}: UserRoleSelectProps) => {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleChange(evt: React.ChangeEvent<HTMLSelectElement>) {
        
        const newRole = evt.target.value as UserRole;

        const canChangeRole = await admin.hasPermission({
            permissions: {
                user: ["set-role"]
            }
        }) 

        
        if (!canChangeRole.data?.success) {
            return alert("You do not have permission to change user roles.");
        }

        await admin.setRole({
            userId,
            role: newRole,
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    alert(`Error changing role: ${ctx.error.message}`);
                },
                onSuccess: () => {
                    alert("User role updated successfully.");
                    router.refresh();
                }
            }
        })
        
    }
  return (
    <div>
        <select 
        value={role}
        onChange={handleChange}
        disabled={role==='ADMIN' || isPending}
        className="px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
        </select>
        

    </div>
  )
}

export default UserRoleSelect