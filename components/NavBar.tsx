import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
      <nav className="bg-gray-900 text-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/tapup-logo.png" // Replace with your logo image
              alt="TapUp Logo"
              className="w-12 h-12"
              width={100}
              height={100}
            />
            <span className="text-2xl font-extrabold">TapUp</span>
          </div>
          <div>
            <Link
              href="/auth/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg text-lg transition duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    );
  }
  