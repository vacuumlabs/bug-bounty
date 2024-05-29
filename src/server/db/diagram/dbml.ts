import {pgGenerate} from 'drizzle-dbml-generator'

import {schema} from '..'

const out = './src/server/db/diagram/schema.dbml'
const relational = true

pgGenerate({schema, out, relational})
