"use client"

import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { deleteUserAction } from "@/lib/actions/user";

interface DeleteUserButtonProps {
    userId: string;
}

export const DeleteUserButton = ({userId}: DeleteUserButtonProps) => {
    const [isPending, setIsPending] = useState(false);

    async function handleClick() {
        setIsPending(true);

        const { error } = deleteUserAction({userId});

        if (error) {
            console.error("Failed to delete user:", error);
        }else{
            console.log("User deleted successfully");
        }
        setIsPending(false);
    }

  return (
    <Button 
        size='icon' 
        variant='destructive' 
        aria-label="Delete User" 
        className="size-7 rounded-sm cursor-pointer" 
        disabled={isPending} 
        onClick={handleClick}
    >
        <span className="sr-only">Delete User</span>
        <TrashIcon/>   
    </Button>
  )
}

export const PlaceHolderDeleteUserButton = () => {
    return (
    <Button 
        size='icon' 
        variant='destructive' 
        aria-label="Delete User" 
        className="size-7 rounded-sm" 
        disabled
    >
        <span className="sr-only">Delete User</span>
        <TrashIcon/>   
    </Button>
  )
}