declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface JWT {
    role?: string;
  }
}