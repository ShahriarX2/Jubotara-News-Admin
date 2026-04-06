"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api, User as UserType } from "../app/lib/api";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  User,
  FolderTree,
  Users,
  BarChart3,
  Settings,
  Contact2,
  Mail,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      // Defer execution to avoid synchronous setState inside useEffect
      await Promise.resolve();
      
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Failed to parse user from localStorage", err);
        }
      }

      // Also fetch fresh user data from API to ensure name is correct
      try {
        const data = await api("/auth/me");
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };

    initializeUser();
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create News", href: "/dashboard/create", icon: PlusCircle },
    { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Team", href: "/dashboard/team", icon: Contact2 },
    { name: "Subscribers", href: "/dashboard/subscribers", icon: Mail },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  const navContent = (
    <>
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between lg:block">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Jubotara Admin
          </h2>
          <button
            type="button"
            title="Close menu"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-3 rounded-lg p-3 transition-colors ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="mb-2 flex items-center space-x-3 p-3 text-gray-400">
          <User size={20} />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user ? user.name : "Loading..."}
            </span>
            {user && (
              <span className="text-xs text-gray-500 capitalize">
                {user.role}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-lg p-3 text-red-400 transition-colors hover:bg-red-900/30"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <button
          type="button"
          title="Open menu"
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-lg font-bold text-gray-900">Jubotara Admin</h2>
        <div className="w-10" />
      </header>

      {isOpen ? (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-900 text-gray-100 transition-transform lg:z-20 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
