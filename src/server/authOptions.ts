/* eslint-disable @typescript-eslint/consistent-type-definitions */
import {DrizzleAdapter} from '@auth/drizzle-adapter'
import {type DefaultSession, type NextAuthOptions} from 'next-auth'
import {type Adapter} from 'next-auth/adapters'
import TwitterProvider from 'next-auth/providers/twitter'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import EmailProvider, {EmailUserConfig} from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import {DefaultJWT} from 'next-auth/jwt'
import {z} from 'zod'

import {verifyCredentials} from './actions/auth/verifyCredentials'
import {UserRole} from './db/models'

import {db} from '@/server/db'
import {env} from '@/env'
import {PATHS} from '@/lib/utils/common/paths'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole | null
      provider: string | undefined
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: UserRole | null
    provider: string | undefined
  }
}

const updateSessionSchema = z
  .object({
    role: z.enum([UserRole.AUDITOR, UserRole.PROJECT_OWNER]),
  })
  .partial()
  .optional()

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: PATHS.signIn,
  },
  callbacks: {
    jwt: async ({token, user, trigger, account, session}) => {
      const sessionData = updateSessionSchema.parse(session)

      if (trigger === 'update' && sessionData?.role) {
        token.role = sessionData.role
      }

      if (trigger !== 'signIn' && trigger !== 'signUp') {
        return token
      }

      const userData = await db.query.users.findFirst({
        where: (users, {eq}) => eq(users.id, user.id),
        columns: {
          role: true,
        },
      })

      if (!userData) {
        throw new Error('User not found')
      }

      token.role = userData.role
      token.provider = account?.provider
      return token
    },
    session: ({session, token}) => {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          id: token.sub,
          provider: token.provider,
        },
      }
    },
    signIn: ({user, account}) => {
      if (account?.provider !== 'credentials') {
        return true
      }

      // only allow sign in with credentials if email is verified, otherwise redirect to verify email page
      if (!('emailVerified' in user) || !user.emailVerified) {
        const redirectUrl = user.email
          ? `/auth/verify-email?email=${user.email}`
          : '/auth/verify-email'
        return redirectUrl
      }

      return true
    },
  },
  adapter: DrizzleAdapter(db) as Adapter,
  session: {
    strategy: 'jwt',
  },
  providers: [
    // OAuth providers don't work in Vercel previews due to dynamic domain URL
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      name: 'Twitter',
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: 'read:user user:email public_repo',
        },
      },
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: {label: 'Email', type: 'email'},
        password: {label: 'Password', type: 'password'},
      },
      authorize: verifyCredentials,
    }),
    EmailProvider({
      name: 'Magic link',
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    } as EmailUserConfig),
  ],
  debug: env.NODE_ENV === 'development',
}
