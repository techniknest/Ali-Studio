import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [{ seedBootstrapAdmin }, { connectDB }, { default: Admin }] =
          await Promise.all([
            import("@/lib/bootstrap"),
            import("@/lib/mongodb"),
            import("@/models/Admin"),
          ]);

        await seedBootstrapAdmin();

        try {
          await connectDB();
        } catch {
          const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
          const bootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
          if (
            bootstrapEmail &&
            bootstrapPassword &&
            String(credentials.email).toLowerCase() ===
              bootstrapEmail.toLowerCase() &&
            String(credentials.password) === bootstrapPassword
          ) {
            return { id: "bootstrap", email: bootstrapEmail.toLowerCase() };
          }
          return null;
        }

        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        const admin = await Admin.findOne({ email });
        if (!admin) return null;

        if (admin.lockUntil && admin.lockUntil > new Date()) {
          throw new Error("Account locked. Try again in 15 minutes.");
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) {
          admin.loginAttempts = (admin.loginAttempts ?? 0) + 1;
          if (admin.loginAttempts >= MAX_ATTEMPTS) {
            admin.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
            admin.loginAttempts = 0;
          }
          await admin.save();
          return null;
        }

        admin.loginAttempts = 0;
        admin.lockUntil = undefined;
        await admin.save();

        return { id: admin._id.toString(), email: admin.email };
      },
    }),
  ],
});
