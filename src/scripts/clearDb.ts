/* eslint-disable unicorn/no-process-exit */

import {clearDb} from '../server/db/clearDb'

await clearDb()
process.exit(0)
