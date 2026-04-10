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

        if (!user || !user.isActive || !user.isApproved) return null;

        const isValid = await compare(password, user.password);
        const isAltValid = user.passwordAlt ? await compare(password, user.passwordAlt) : false;
        if (!isValid && !isAltValid) return null;

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
          firstName: user.firstName,
          lastName: user.lastName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.employeeId = user.employeeId;
        token.department = user.department;
        token.firstName = (user as { firstName?: string }).firstName;
        token.lastName = (user as { lastName?: string }).lastName;
      }
      if (trigger === "update" && session) {
        if (session.firstName) token.firstName = session.firstName;
        if (session.lastName) token.lastName = session.lastName;
        if (session.name) token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.employeeId = token.employeeId as string;
        session.user.department = token.department as string;
        if (token.firstName && token.lastName) {
          session.user.name = `${token.firstName} ${token.lastName}`;
        }
      }
      return session;
    },
  },
});
