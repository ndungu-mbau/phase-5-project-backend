import { eq } from 'drizzle-orm'
import { app } from '../api'
import { createSession } from './sessions'
import { db, users } from '../db'
import { setCookie } from 'hono/cookie'
import { Context } from 'hono'

// Signup handler
export const signUp = async (c: Context) => {
  const { email, password, address } = await c.req.json()
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute()

  if (existingUser.length > 0) {
    return c.json({ error: 'User already exists' }, 400)
  }

  const [user] = await db
    .insert(users)
    .values({ email, password, address })
    .returning()
    .execute()

  const sessionId = await createSession(user.user_id)
  setCookie(c, 'sessionId', sessionId, { httpOnly: true })
  return c.json({ message: 'User created successfully' }, 201)
}

// Login handler
export const login = async (c: Context) => {
  const { email, password } = await c.req.json()
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute()

  if (!user || user.password !== password) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const sessionId = await createSession(user.user_id)
  setCookie(c, 'sessionId', sessionId, { httpOnly: true })
  return c.json({ message: 'Login successful' }, 200)
}
