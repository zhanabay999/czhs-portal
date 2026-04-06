export type UserRole =
  | "super_admin"
  | "admin"
  | "content_manager"
  | "hr_manager"
  | "contest_manager"
  | "sports_manager"
  | "moderator"
  | "news_moderator"
  | "social_admin"
  | "employee";

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ["*"],
  admin: [
    "news:*",
    "sanatorium:*",
    "vacancy:*",
    "camp:*",
    "faq:*",
    "contest:*",
    "sports:*",
    "partners:*",
    "hotel:*",
    "audit:read",
    "admin:access",
    "export:*",
  ],
  content_manager: [
    "news:*",
    "sanatorium:*",
    "camp:*",
    "upload:*",
    "admin:access",
  ],
  hr_manager: ["vacancy:*", "admin:access", "export:*"],
  contest_manager: ["contest:*", "admin:access", "export:*"],
  sports_manager: ["sports:*", "admin:access", "export:*"],
  moderator: ["faq:*", "admin:access"],
  news_moderator: [
    "news:*",
    "upload:*",
    "admin:access",
  ],
  social_admin: [
    "partners:*",
    "hotel:*",
    "upload:*",
    "admin:access",
  ],
  employee: ["profile:*", "vote:create"],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  if (perms.includes("*")) return true;
  return perms.some((p) => {
    if (p === permission) return true;
    if (p.endsWith(":*")) {
      const domain = p.replace(":*", ":");
      return permission.startsWith(domain);
    }
    return false;
  });
}

export function canAccessAdmin(role: UserRole): boolean {
  return role !== "employee";
}

export const ADMIN_NAV_ITEMS = [
  {
    title: "dashboard",
    href: "/admin",
    permission: "admin:access",
    icon: "LayoutDashboard",
    superAdminOnly: false,
  },
  {
    title: "news",
    href: "/admin/news",
    permission: "news:read",
    icon: "Newspaper",
    superAdminOnly: false,
  },
  {
    title: "sanatorium",
    href: "/admin/sanatorium",
    permission: "sanatorium:read",
    icon: "Heart",
    superAdminOnly: false,
  },
  {
    title: "summerCamp",
    href: "/admin/summer-camp",
    permission: "camp:read",
    icon: "Sun",
    superAdminOnly: false,
  },
  {
    title: "faq",
    href: "/admin/faq",
    permission: "faq:read",
    icon: "HelpCircle",
    superAdminOnly: false,
  },
  {
    title: "contest",
    href: "/admin/beauty-contest",
    permission: "contest:read",
    icon: "Crown",
    superAdminOnly: false,
  },
  {
    title: "sports",
    href: "/admin/sports",
    permission: "sports:read",
    icon: "Trophy",
    superAdminOnly: false,
  },
  {
    title: "users",
    href: "/admin/users",
    permission: "admin:access",
    icon: "Users",
    superAdminOnly: true,
  },
  {
    title: "settings",
    href: "/admin/settings",
    permission: "admin:access",
    icon: "Settings",
    superAdminOnly: true,
  },
] as const;
