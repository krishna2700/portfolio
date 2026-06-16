"use client";
import { useEffect, useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

type AdminUser = { email: string; name: string };

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.success && data?.user) {
          setAdminUser(data.user);
          setIsAuthenticated(true);
        }
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  const handleLogin = (user: AdminUser) => {
    setAdminUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <div className="min-h-screen bg-[#030712]">
      {checkingSession ? (
        <div className="min-h-screen flex items-center justify-center text-slate-400">
          Checking admin session...
        </div>
      ) : !isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard user={adminUser!} onLogout={handleLogout} />
      )}
    </div>
  );
}
