"use client"
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || "Default" // Get the error type from the query parameter

  // Map errors to messages
  const errorMessages: { [key: string]: string } = {
    Configuration: "There seems to be a configuration issue. Please contact support.",
    AccessDenied: "Access Denied! You don't have permission to access this resource.",
    Verification: "The verification link is invalid or has expired. Please try again.",
    OAuthAccountNotLinked: "This account is not linked to your profile. Please sign in with the provider you used to create your account or link this provider in your account settings.",
    Default: "An unknown error occurred. Please try again later.",
  };

  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-8 max-w-lg bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Authentication Error</h1>
        <p className="text-lg mb-6">{message}</p>
        <button
          onClick={() => router.push("/")} // Redirect to the home page
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none transition duration-300"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
}
