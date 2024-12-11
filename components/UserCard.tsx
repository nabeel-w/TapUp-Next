import { useUserPlan } from "@/context/userPlanContext";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface UserCardProps {
  user?: User;
}

export default function UserCard({ user }: UserCardProps) {
  const defaultUser: User = {
    id: "0",
    name: "Guest User",
    email: "guest@example.com",
    image: "/images/user.png",
  };

  const displayUser = user || defaultUser;
  const { userPlan, loading, error } = useUserPlan();

  if (loading) {
    return (
      <div className="relative top-64 left-4  h-full">
        <p className="text-white bg-gray-800 px-4 py-2 rounded-md shadow-md">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative top-64 left-4  h-full">
        <p className="text-red-500 bg-gray-800 px-4 py-2 rounded-md shadow-md">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <div className="absolute top-4 left-4 bg-gray-800 rounded-lg shadow-lg p-6 w-80">
        <div className="flex flex-col items-center">
          <Image
            src={displayUser.image || "/images/user.png"}
            alt="User Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-lg"
            width={100}
            height={100}
          />
          <h1 className="text-xl font-semibold mt-4">{displayUser.name}</h1>
          <p className="text-gray-400">{displayUser.email}</p>
        </div>
        <div className="bg-gray-800 text-white p-4 pt-6 pb-2 rounded-lg shadow-md max-w-sm">
          <h2 className="text-lg font-semibold mb-2">{userPlan?.subscriptionName} Plan</h2>
          <p className="text-sm">
            <span className="font-medium text-gray-400">Start Date:</span>{' '}
            {new Date(userPlan?.startDate ?? '').toLocaleDateString()}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-400">End Date:</span>{' '}
            {userPlan?.endDate ? new Date(userPlan?.endDate).toLocaleDateString() : 'Never'}
          </p>
        </div>
      </div>
    </div>
  );
}
