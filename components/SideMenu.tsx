import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaHome, FaUser, FaKey, FaFile, FaSignOutAlt } from 'react-icons/fa'; // You can use other icons too
import Image from 'next/image';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage the collapsed state
  const [isMobileOpen, setIsMobileOpen] = useState(false); // State to manage the sidebar on mobile
  const pathname = usePathname();

  const menuItems = [
    { label: 'Upload Files', href: '/upload', icon: <FaFile /> },
    { label: 'Home', href: '/home', icon: <FaHome /> },
    { label: 'API Key', href: '/api-key', icon: <FaKey /> },
    { label: 'Profile', href: '/profile', icon: <FaUser /> },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed); // Toggle the collapsed state
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen); // Toggle mobile sidebar

  return (
    <div>
      {/* Sidebar Button for Mobile */}
      <button
        onClick={toggleMobileSidebar}
        className={isMobileOpen ? "hidden" :"md:hidden fixed top-4 left-4 z-50 text-white bg-gray-900 p-2 rounded-md"}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-transform duration-300 z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:relative md:w-${isCollapsed ? '16' : '64'}`}
      >
        <div className="p-4">
          <div className="mb-8 flex justify-between items-center">
            <div className={`${isCollapsed && 'hidden'} flex items-center space-x-4`}>
              <Image
                src="/images/tapup-logo.png" // Replace with your logo image
                alt="TapUp Logo"
                className="w-8 h-8"
                width={100}
                height={100}
              />
              <span className={`text-2xl font-extrabold`}>TapUp</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="hidden md:block text-white p-2 rounded-md focus:outline-none"
            >
              <FaBars size={24} />
            </button>
          </div>
          <nav>
            <ul>
              {menuItems.map((item) => (
                <li key={item.href} className="mb-4">
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-md ${pathname === item.href
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                      }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span className={`${isCollapsed ? 'hidden' : ''}`}>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto">
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="flex items-center px-4 py-2 mt-4 w-full text-red-500 hover:bg-gray-700 rounded-md"
            >
              <FaSignOutAlt size={20} className="mr-2" />
              <span className={`${isCollapsed ? 'hidden' : ''}`}>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div
          onClick={toggleMobileSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
