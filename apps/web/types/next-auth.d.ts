import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    username: string,
    balance: number // Add your custom fields here
  }

  interface Session {
    user: User // Replace the default user with your custom user
  }
}
