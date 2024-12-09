"use client"
import ApiKeySelector from "@/components/apiKeySelector";
import DragAndDrop from "@/components/DragDrop";
import { ApiKeyProvider } from "@/context/apiKeyContext";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';


const UploadFilePage = () => {

  const session = useSession();
  
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      redirect('/auth/login')
    }
  }, [session])

  return (
    <div className="min-h-full bg-gray-900 text-white flex flex-grow items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 pt-2 w-full max-w-2xl">
        <ApiKeyProvider>
          <ApiKeySelector />
          <h1 className="text-3xl font-bold text-center mb-8">Upload Your File</h1>
          <DragAndDrop />
        </ApiKeyProvider>
      </div>
    </div>
  );
};

export default UploadFilePage;
