import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as account from './schema/account'
import * as contest from './schema/contest'
import * as deduplicatedFinding from './schema/deduplicatedFinding'
import * as finding from './schema/finding'
import * as findingAttachment from './schema/findingAttachment'
import * as knownIssue from './schema/knownIssue'
import * as reward from './schema/reward'
import * as session from './schema/session'
import * as user from './schema/user'
import * as verificationToken from './schema/verificationToken'
import * as contestSeverityWeights from './schema/contestSeverityWeights'

import {env} from '@/env'

export const schema = {
  ...account,
  ...contest,
  ...contestSeverityWeights,
  ...deduplicatedFinding,
  ...finding,
  ...findingAttachment,
  ...knownIssue,
  ...reward,
  ...session,
  ...user,
  ...verificationToken,
}

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined
}

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL)

if (env.NODE_ENV !== 'production') globalForDb.conn = conn

export const db = drizzle(conn, {schema})
