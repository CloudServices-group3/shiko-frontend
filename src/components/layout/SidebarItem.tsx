import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  href?: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  isDanger?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  href,
  label,
  icon: Icon,
  isActive = false,
  isDanger = false,
  onClick
}: SidebarItemProps) {
  const pathname = usePathname();

  const isSelected = (href && pathname === href) || isActive;

  const iconClass = isDanger
    ? "bg-p2 text-fff group-hover:shadow-sm group-hover:shadow-p2/30"
    : isSelected
      ? "bg-p2 text-fff shadow-sm shadow-p2/30"
      : "bg-eee text-p1 group-hover:bg-ddd";

  const textClass = isDanger
    ? "text-p2"
    : isSelected
      ? "text-p2"
      : "text-p1 group-hover:text-000";

  const baseClass = `flex items-center gap-4 p-1.5 rounded-full transition-all group cursor-pointer ${
    isSelected
      ? "bg-linear-to-r from-p2/10 to-transparent"
      : isDanger
        ? "hover:bg-linear-to-r hover:from-p2/10 hover:to-transparent"
        : "hover:bg-bg"
  }`;

  const content = (
    <>
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${iconClass}`}
      >
        <Icon size={22} strokeWidth={2.5} />
      </div>

      <span className={`figma-p1 transition-colors pr-8 ${textClass}`}>
        {label}
      </span>
    </>
  );

  return (
    <li>
      {onClick ? (
        <button onClick={onClick} className={`${baseClass} w-full`}>
          {content}
        </button>
      ) : (
        <Link href={href!} className={baseClass}>
          {content}
        </Link>
      )}
    </li>
  );
}