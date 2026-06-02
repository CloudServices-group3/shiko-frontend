"use client";

import { isCurrentUserAdmin } from "@/services/current-user-service";
import { useEffect, useState } from "react";
import SidebarItem from "@/components/layout/SidebarItem";
import Image from "next/image";
import { LayoutGrid, Video, GraduationCap, User, LogOut, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

// JWT-decoder 
function parseJwt(token: string) {
  const base64 = token.split(".")[1];
  return JSON.parse(atob(base64));
}

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const router = useRouter();  // use router to redirect
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  //set state for email
  const [userEmail, setUserEmail] = useState<string>("user@email.com");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        router.replace("/sign-in");
        return;
      }

      try {
        // decode token and save e-mail to state
        const decoded = parseJwt(token);
        if (decoded && decoded.email) {
          setUserEmail(decoded.email);
        }
      } catch (err) {
        console.error("Something went wrong trying to decode token", err);
      }

      setIsAdmin(isCurrentUserAdmin());
      setIsCheckingAuth(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [router]);

  const handleLogout = async () => {
    const token = sessionStorage.getItem("token");
    const refreshToken = sessionStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await fetch("https://shiko-auth-api-2.azurewebsites.net/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.warn("Could not connect to auth api");
    }

    sessionStorage.clear();
    localStorage.clear();
    router.replace("/sign-in");
  };

  if (isCheckingAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* General Grid layout */}
      <div className="mx-auto grid h-screen w-full max-w-480 bg-bg p-7.5 gap-7.5 
                      grid-cols-[280px_1fr] grid-rows-[auto_1fr] font-shiko overflow-hidden">
        
        {/* LOGO  */}
        <div className="bg-fff rounded-3xl p-8 flex justify-left">
          <Image
            src="/images/Shiko-logo.svg" 
            alt="Shiko Logo"
            width={143} 
            height={35}
            priority
          />
        </div>

        {/* TOPBAR */}
        <header className="bg-fff rounded-3xl px-8 flex items-center justify-end">
          <div className="flex items-center gap-4">
            
            {/* Placeholder profile pic */}
            <div className="w-12 h-12 rounded-full bg-eee overflow-hidden border-2 border-fff shadow-sm">
              
            </div>
            <div className="text-left">
              <p className="figma-b2 text-aaa">{userEmail}</p>
            </div>
          </div>
        </header>

        {/* 3. MENU / ASIDE  */}
        <aside className="bg-fff rounded-3xl p-7 h-fit">

          <p className="figma-b2 font-bold text-aaa mb-6">MENU</p>
          <ul className="space-y-2 mb-10">
            <SidebarItem href="/dashboard" label="Dashboard" icon={LayoutGrid} />
            <SidebarItem href="/courses" label="Courses" icon={GraduationCap} />
            <SidebarItem href="/live-chat" label="Live Chat" icon={Video} />
          </ul>

          <p className="figma-b2 font-bold text-aaa mb-6">GENERAL</p>
          <ul className="space-y-2">
            <SidebarItem href="/profile" label="Profile" icon={User} />

            {isAdmin && (
              <SidebarItem
                href="/admin"
                label="Admin"
                icon={ShieldCheck}
                isActive={isAdminRoute}
              />
            )}

            {/* send in 'isActive' to set Log Out to orange */}
            <SidebarItem label="Log Out" icon={LogOut} isDanger onClick={handleLogout} />
          </ul>
        </aside>

        {/* 4. MAIN CONTENT */}
        <main className="overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}