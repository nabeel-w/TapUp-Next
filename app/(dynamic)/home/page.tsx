"use client"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function HomePage(){
    const session = useSession();

    if(session.status==='unauthenticated'){
        redirect('/auth/login')
    }
    return (
        <>

        </>
    );
}