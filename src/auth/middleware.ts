import { Context, Next } from 'hono'
import { getSession } from './sessions'
import { getCookie } from 'hono/cookie'

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
