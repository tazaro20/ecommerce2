/* eslint-disable @typescript-eslint/no-explicit-any */
import mongodb from './mongodb'
import UserModel from './models/UserModel'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'
import NextAuth from 'next-auth'

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        try {
          await mongodb()
          console.log('MongoDB connected successfully')
          if (!credentials) {
            console.log('No credentials provided')
            throw new Error('No credentials provided')
          }
      
          const user = await UserModel.findOne({ email: credentials.email })
          if (!user) {
            console.log('User not found:', credentials.email)
            throw new Error('User not found')
          }
      
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (!isMatch) {
            console.log('Invalid password for user:', credentials.email)
            throw new Error('Invalid password')
          }
      
          console.log('User authenticated successfully:', user.email)
          return user
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    }),
  ],
  pages: {
    signIn: '/signin',
    newUser: '/register',
    error: '/signin',
  },
  callbacks: {
    authorized({ request, auth }: { request: any; auth: any }) {
      const protectedPaths = [
        /\/shipping/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order(,*)/,
        /\/admin/,
      ]
      const { pathname } = request.nextUrl
      if (protectedPaths.some((p) => p.test(pathname))) return !!auth
      return true
    },
    async jwt({
      user,
      trigger,
      session,
      token,
    }: {
      user?: any
      trigger?: string
      session?: any
      token: JWT
    }) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        }
      }
      if (trigger === 'update' && session) {
        token.user = {
          ...(token.user || {}),
          email: session.user.email,
          name: session.user.name,
        }
      }
      return token
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user
      }
      return session
    },
  },
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config)
