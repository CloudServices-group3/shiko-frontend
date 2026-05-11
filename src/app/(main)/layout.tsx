"use client";

import SidebarItem from "@/components/layout/SidebarItem";
import Image from "next/image";
import { LayoutGrid, GraduationCap, User, LogOut } from "lucide-react";


export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* General Grid layout */
    <div className="grid h-screen w-full bg-bg p-7.5 gap-7.5 
                    grid-cols-[280px_1fr] grid-rows-[auto_1fr] font-shiko overflow-hidden">
      
      {/* LOGO  */}
      <div className="bg-fff rounded-3xl p-8 flex justify-left">
        <Image
          src="/images/Shiko-logo.svg" 
          alt="Shiko Logo"
          width={130} 
          height={40}
          priority
        />
      </div>

      {/* TOPBAR */}
      <header className="bg-fff rounded-3xl px-8 flex items-center justify-end">
        <div className="flex items-center gap-4">
          
          <div className="w-12 h-12 rounded-full bg-eee overflow-hidden border-2 border-fff shadow-sm">
            
             {/* Profile pic here */}

          </div>
          <div className="text-left">
            <p className="figma-b3 font-bold text-p1">Profile name</p>
            <p className="text-[11px] text-aaa">Profile email</p>
          </div>
        </div>
      </header>

      {/* 3. MENU / ASIDE  */}
      <aside className="bg-fff rounded-3xl p-8 overflow-y-auto">

        <p className="text-[12px] font-bold text-aaa uppercase tracking-widest mb-6">Menu</p>
        <ul className="space-y-4 mb-10">
          <SidebarItem href="/dashboard" label="Dashboard" icon={LayoutGrid} />
          <SidebarItem href="/courses" label="Courses" icon={GraduationCap} />
          <SidebarItem href="/my-courses" label="My Courses" icon={GraduationCap} />

        </ul>

        <p className="text-[12px] font-bold text-aaa uppercase tracking-widest mb-6">General</p>
        <ul className="space-y-4">
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
  );
}