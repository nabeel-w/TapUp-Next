"use client"
import StorageUsage from '@/components/StorageUsage';
import UserCard from '@/components/UserCard';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

const ProfilePage = () => {
    const session = useSession();

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            redirect('/auth/login')
        }
    }, [session])
    return (
        <>
            <UserCard user={session.data?.user} />
            <StorageUsage />
        </>
    );
};

export default ProfilePage;
