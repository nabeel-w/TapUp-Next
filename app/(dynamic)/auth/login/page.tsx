"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from 'react';
import SigninBtnCustom from "@/components/SigninBtnCustom";
import { SessionProvider, useSession } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const session = useSession();

  useEffect(() => {
    if (error) {
      router.push(`/error?error=${error}`);
    }
    if (session.status === 'authenticated') {
      router.push("/home");
    }
  }, [error, router, session]);

  if (session.status === 'loading')
    return (
      <div className="w-36">
        <div className="relative top-4 left-4">
          <p className="text-white bg-gray-800 px-4 py-2 rounded-md shadow-md">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg min-h-2.5">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Get Started With TapUp
        </h1>
        <div className="flex flex-col space-y-4">
          <SigninBtnCustom provider={{ id: "github", name: "GitHub" }} />
          <SigninBtnCustom provider={{ id: "google", name: "Google" }} />
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense>
      <SessionProvider>
        <Login />
      </SessionProvider>
    </Suspense>
  )
};