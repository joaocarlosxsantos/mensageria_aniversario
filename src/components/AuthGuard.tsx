"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === "/login" || pathname === "/cadastrar";
      if (!user && !isAuthPage) {
        router.replace("/login");
      }
      if (user && isAuthPage) {
        router.replace("/");
      }
    }
  }, [user, loading, pathname, router]);

  const isAuthPage = pathname === "/login" || pathname === "/cadastrar";
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-indigo-700 font-semibold text-lg">Carregando...</span>
        </div>
      </div>
    );
  }
  if ((!user && !isAuthPage) || (user && isAuthPage)) {
    return null;
  }
  return <>{children}</>;
} 