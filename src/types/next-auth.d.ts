import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    employeeId?: string | null;
    department?: string | null;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      employeeId: string;
      department: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    employeeId?: string;
    department?: string;
  }
}
