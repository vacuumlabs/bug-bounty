import {loadEnvConfig} from '@next/env'
import {cwd} from 'node:process'
import {type Config} from 'drizzle-kit'

loadEnvConfig(cwd())

// Config for drizzle-kit
export default {
  schema: './src/server/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
} satisfies Config
