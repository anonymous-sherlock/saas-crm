"use client"
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function AdminPage() {
    return (
        <>
            <Button onClick={() => signIn("credentials", {
                email: "test123@gmail.com",
                password: "Test@123"
            })}>Login</Button>

        </>
    )
}