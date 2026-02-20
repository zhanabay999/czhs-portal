import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/kk/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        employeeId: { label: "Employee ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.employeeId || !credentials?.password) return null;

        const employeeId = credentials.employeeId as string;
        const password = credentials.password as string;

        // Validate: employee ID is up to 7 digits
        if (!/^\d{1,7}$/.test(employeeId)) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.employeeId, employeeId))
          .limit(1);

        if (!user || !user.isActive) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        await db
          .update(users)
          .set({ lastLoginAt: new Date() })
          .where(eq(users.id, user.id));

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          employeeId: user.employeeId,
          department: user.department,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.employeeId = user.employeeId;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.employeeId = token.employeeId as string;
        session.user.department = token.department as string;
      }
      return session;
    },
  },
});
