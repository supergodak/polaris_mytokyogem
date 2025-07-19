import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: NextAuthOptions = {
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
    async jwt({ token, user }) {
      if (user) {
        token.role = 'admin';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };