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
      </div>
    </div>
  );
}
