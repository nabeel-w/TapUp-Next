"use client"
import { useRouter, useSearchParams  } from "next/navigation";
import { useEffect } from 'react';
import SigninBtnCustom from "@/components/SigninBtnCustom";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  useEffect(() => {
    if (error) {
      router.push(`/auth/error?error=${error}`);
    }
  }, [error, router]);

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

export default LoginPage;