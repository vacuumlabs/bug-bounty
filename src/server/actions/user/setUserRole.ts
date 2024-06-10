'use server'

import {z} from 'zod'
import {eq} from 'drizzle-orm'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {db, schema} from '@/server/db'
import {UserRole} from '@/server/db/models'
import {requireServerSession} from '@/server/utils/auth'

const setUserRoleSchema = z.enum([UserRole.AUDITOR, UserRole.PROJECT_OWNER])
export type SetUserRoleEnum = z.infer<typeof setUserRoleSchema>

export const setUserRoleAction = async (request: SetUserRoleEnum) => {
  const session = await requireServerSession()
  const id = session.user.id

  const userRole = setUserRoleSchema.parse(request)

  return db
    .update(schema.users)
    .set({role: userRole})
    .where(eq(schema.users.id, id))
    .returning()
}

export const setUserRole = serializeServerErrors(setUserRoleAction)
