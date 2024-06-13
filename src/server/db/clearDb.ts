import {sql} from 'drizzle-orm'

import {db} from '.'

export const clearDb = async () => {
  const dbSchema = db._.schema

  if (dbSchema) {
    const tableNames = Object.values(dbSchema)
      .map((table) => `"${table.dbName}"`)
      .join(', ')

    await db.execute(sql.raw(`truncate table ${tableNames};`))

    console.log('Truncated all DB tables')
  }
}
