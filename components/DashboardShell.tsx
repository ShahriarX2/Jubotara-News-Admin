"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { LoadingState } from "@/components/DashboardState";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const timer = window.setTimeout(() => {
      setIsCheckingAuth(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <LoadingState label="Checking session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      {children}
    </div>
  );
}

export function DashboardPage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const classes =
    "w-full px-4 py-4 sm:px-6 sm:py-6 lg:ml-64 lg:w-[calc(100%-16rem)] lg:p-8";

  return <main className={`${classes} ${className}`.trim()}>{children}</main>;
}
