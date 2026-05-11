"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

/**
 * Props for the SidebarItem component.
 * @param href - The destination URL (e.g., "/dashboard").
 * @param label - The text to display in the menu.
 * @param icon - The Lucide icon component to render.
 * @param active - Optional: Manually forces the item to its active visual state (useful for buttons like Log Out).
 */
interface SidebarItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean; 
}

export default function SidebarItem({ 
  href, 
  label, 
  icon: Icon, 
  isActive = false 
}: SidebarItemProps) {
  const pathname = usePathname();
  
  // isSelected is true if pathname = href (link is active) or prop was sent in as true
  const isSelected = pathname === href || isActive;

  return (
    <li>
      <Link 
        href={href} 
        className={`flex items-center gap-4 p-2 rounded-2xl transition-all group ${
          isSelected ? "bg-p2/5" : "hover:bg-bg"
        }`}
      >
        {/* Icon: orange bg if isSelected is true */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
          isSelected 
            ? "bg-p2 text-fff shadow-sm shadow-p2/30" 
            : "bg-eee text-p1 group-hover:bg-ddd"
        }`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>

        {/* text orange if isSelected is true */}
        <span className={`figma-b2 font-semibold transition-colors ${
          isSelected ? "text-p2" : "text-p1 group-hover:text-000"
        }`}>
          {label}
        </span>
      </Link>
    </li>
  );
}