"use client";

import { OAuthProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";


export default function SigninBtnCustom({
  provider,
}: {
  provider: { id: OAuthProviderType; name: string };
}) {
  return (
    <button onClick={() => signIn(provider.id, { callbackUrl: '/home' })}  className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition duration-300">
      {provider.name==="Google"?<FaGoogle className="mr-2" size={20} />:<FaGithub className="mr-2" size={20} />}
      Sign in with {provider.name}
    </button>
  );
}