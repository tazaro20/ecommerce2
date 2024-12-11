import 'next-auth'

declare module 'next-auth' {
  interface User {
    isAdmin?: boolean
  }
}

export interface User extends DefaultUser {
    _id?: string
    isAdmin?: boolean
  }