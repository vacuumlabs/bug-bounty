import {loadEnvConfig} from '@next/env'
import {cwd} from 'node:process'
import {type Config} from 'drizzle-kit'

loadEnvConfig(cwd())

// Config for drizzle-kit
export default {
  schema: './src/server/db/schema',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? '',
  },
} satisfies Config
