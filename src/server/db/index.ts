import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as user from './schema/user'

import {env} from '@/env'

export const schema = {
  ...user,
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
