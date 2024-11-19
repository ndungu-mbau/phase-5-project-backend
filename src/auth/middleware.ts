import { Context, Next } from 'hono'
import { getSession } from './sessions'
import { getCookie } from 'hono/cookie'
import { db, users } from '../db'
import ac from './permissions'
import { eq } from 'drizzle-orm'

type Action =
  | 'readAny'
  | 'readOwn'
  | 'createAny'
  | 'createOwn'
  | 'updateAny'
  | 'updateOwn'
  | 'deleteAny'
  | 'deleteOwn'

// Authentication middleware
export const authenticate = async (c: Context, next: Next) => {
  const sessionId = getCookie(c, 'sessionId')

  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const session = await getSession(sessionId)

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  c.set('userId', session.user_id)
  await next()
}

// Authorization middleware
export const authorize = (model: string, action: Action) => {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Fetch user from the database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userId))
      .execute()

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Check if the user has the required permission using AccessControl
    const permission = ac.can(user.role)[action](model)

    if (!permission.granted) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    await next()
  }
}
