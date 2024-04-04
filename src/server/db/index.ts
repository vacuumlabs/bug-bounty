import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as user from './schema/user'
import * as contest from './schema/contest'
import * as finding from './schema/finding'
import * as reward from './schema/reward'

import {env} from '@/env'

export const schema = {
  ...user,
  ...contest,
  ...finding,
  ...reward,
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
