import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          return {
            id: '1',
            name: 'Admin',
            email: 'admin@mytokyogem.com'
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user: Record<string, unknown> | undefined }) {
      if (user) {
        token.role = 'admin';
      }
      return token;
    },
    async session({ session, token }: { session: Record<string, unknown>; token: Record<string, unknown> }) {
      if (session.user && typeof session.user === 'object' && session.user !== null) {
        (session.user as Record<string, unknown>).role = token.role as string;
      }
      return session;
    }
  }
};

// @ts-expect-error - NextAuth types issue
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };