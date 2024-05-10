import {sql} from 'drizzle-orm'

import {db} from '@/server/db'

export const trunacateDb = async () => {
  const dbSchema = db._.schema

  if (!dbSchema) {
    throw new Error('Database schema not found.')
  }

  const tableNames = Object.values(dbSchema)
    .map((table) => `"${table.dbName}"`)
    .join(', ')

  await db.execute(sql.raw(`truncate table ${tableNames} cascade;`))
}
