import {DrizzleAdapter} from '@auth/drizzle-adapter'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth'
import {type Adapter} from 'next-auth/adapters'
import TwitterProvider from 'next-auth/providers/twitter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider, {EmailUserConfig} from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'

import {verifyCredentials} from './actions/verifyCredentials'

import {env} from '@/env'
import {db} from '@/server/db'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    newUser: '/profile/connect-wallet',
  },
  callbacks: {
    session: ({session, token}) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  adapter: DrizzleAdapter(db) as Adapter,
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      name: 'Twitter',
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
}

export const getServerAuthSession = () => getServerSession(authOptions)
