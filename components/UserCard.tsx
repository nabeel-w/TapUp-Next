import { useUserPlan } from "@/context/userPlanContext";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function UserCard() {
  const displayUser = useSession().data?.user;
  const { userPlan, loading, error } = useUserPlan();

  if (loading || !displayUser) return null;
  if (error) return null;

  return (
    <div className="bg-gray-900 text-white p-4 flex flex-col items-center">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <Image
            src={displayUser.image || "/images/user.png"}
            alt="User Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-lg"
            width={100}
            height={100}
          />
          <h1 className="text-xl font-semibold mt-4 text-center">{displayUser.name}</h1>
          <p className="text-gray-400 text-center">{displayUser.email}</p>
        </div>
        <div className="bg-gray-800 text-white mt-6 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-center">{userPlan?.subscriptionName} Plan</h2>
          <p className="text-sm">
            <span className="font-medium text-gray-400">Start Date:</span>{" "}
            {new Date(userPlan?.startDate ?? "").toLocaleDateString()}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-400">End Date:</span>{" "}
            {userPlan?.endDate ? new Date(userPlan?.endDate).toLocaleDateString() : "Never"}
          </p>
        </div>
      </div>
    </div>
  );
}
