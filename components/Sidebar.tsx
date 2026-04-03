"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, LogOut, User, FolderTree, Users, BarChart3, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create News", href: "/dashboard/create", icon: PlusCircle },
    { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Jubotara Admin
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 p-3 mb-2 text-gray-400">
          <User size={20} />
          <span className="text-sm font-medium">Admin User</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-900/30 text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
