// app/auth.config.ts
export const authConfig = {
    pages: {
      signIn: '/auth/signin',
    },
    callbacks: {
        //@ts-ignore
      authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
        if (isOnDashboard) {
          if (isLoggedIn) return true;
          return false;
        }
        return true;
      },
    },
    providers: [],
  }