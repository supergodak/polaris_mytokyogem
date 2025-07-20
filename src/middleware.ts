import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    // この関数は認証が成功した場合のみ実行される
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // /admin パスの場合、認証が必要
        if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*']
};