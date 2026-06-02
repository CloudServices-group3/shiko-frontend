export type CurrentUser = {
  userId: string;
  email: string;
  roles: string[];
};

function isCurrentUser(value: unknown): value is CurrentUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as CurrentUser;

  return (
    typeof user.userId === "string" &&
    typeof user.email === "string" &&
    Array.isArray(user.roles)
  );
}

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = sessionStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser);

    if (!isCurrentUser(parsedUser)) {
      return null;
    }

    return parsedUser;
  } catch {
    return null;
  }
}

export function isCurrentUserAdmin(): boolean {
  const user = getCurrentUser();

  return user?.roles.includes("Admin") ?? false;
}