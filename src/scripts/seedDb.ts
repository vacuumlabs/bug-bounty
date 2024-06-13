/* eslint-disable unicorn/no-process-exit */

import {seedDb} from '@/server/db/seed'

await seedDb()
process.exit(0)
