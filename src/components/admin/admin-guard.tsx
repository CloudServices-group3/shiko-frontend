"use client";

import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { isCurrentUserAdmin } from "@/services/current-user-service";

type AdminGuardProps = {
  children: ReactNode;
};

type AdminAccessStatus = "checking" | "admin" | "not-admin";

function subscribeToSessionStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
  };
}

function getAdminAccessStatus(): AdminAccessStatus {
  return isCurrentUserAdmin() ? "admin" : "not-admin";
}

function getServerSnapshot(): AdminAccessStatus {
  return "checking";
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();

  const adminAccessStatus = useSyncExternalStore(
    subscribeToSessionStorage,
    getAdminAccessStatus,
    getServerSnapshot
  );

  const isCheckingAccess = adminAccessStatus === "checking";
  const isAdmin = adminAccessStatus === "admin";

  useEffect(() => {
    if (!isCheckingAccess && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isCheckingAccess, isAdmin, router]);

  if (isCheckingAccess || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}