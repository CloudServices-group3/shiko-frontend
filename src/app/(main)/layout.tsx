"use client";

import SidebarItem from "@/components/layout/SidebarItem";
import Image from "next/image";
import { LayoutGrid, Video, GraduationCap, User, LogOut } from "lucide-react";


export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
              <p className="text-b1 font-bold">Profile name</p>
              <p className="figma-b2 text-aaa">Profile@email.com</p>
            </div>
          </div>
        </header>

        {/* 3. MENU / ASIDE  */}
        <aside className="bg-fff rounded-3xl p-7 h-fit">

          <p className="figma-b2 font-bold text-aaa mb-6">MENU</p>
          <ul className="space-y-2 mb-10">
            <SidebarItem href="/dashboard" label="Dashboard" icon={LayoutGrid} />
            <SidebarItem href="/courses" label="Courses" icon={GraduationCap} />
            <SidebarItem href="/my-courses" label="My Courses" icon={GraduationCap} />
            <SidebarItem href="/live-chat" label="Live Chat" icon={Video} />
          </ul>

          <p className="figma-b2 font-bold text-aaa mb-6">GENERAL</p>
          <ul className="space-y-2">
            <SidebarItem href="/profile" label="Profile" icon={User} />
            {/* send in 'isActive' to set Log Out to orange */}
            <SidebarItem href="/logout" label="Log Out" icon={LogOut} isActive />
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