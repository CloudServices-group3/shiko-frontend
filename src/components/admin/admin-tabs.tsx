"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminTabs = [
  {
    href: "/admin",
    label: "Shiko Admin",
  },
  {
    href: "/admin/lessons",
    label: "Lessons",
  },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="mt-7.5 flex flex-wrap gap-3">
      {adminTabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              isActive
                ? "figma-b2 rounded-[9px] bg-p1 px-6 py-3 text-fff"
                : "figma-b2 rounded-[9px] bg-bg px-6 py-3 text-aaa"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}