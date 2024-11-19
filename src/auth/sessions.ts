import { eq } from 'drizzle-orm'
import { db, sessions } from '../db'

// Function to create a session
export const createSession = async (userId: string): Promise<string> => {
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // Set expiration time (e.g., 30 minutes from now)

  const [res] = await db
    .insert(sessions)
    .values({
      user_id: userId,
      created_at: new Date(),
      expires_at: expiresAt,
    })
    .returning()
    .execute()

  return res.session_id
}

// Function to get a session by session ID
export const getSession = async (sessionId: string) => {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.session_id, sessionId))
    .execute()
  return session ? session : null
}

// Function to delete a session
export const deleteSession = async (sessionId: string) => {
  await db.delete(sessions).where(eq(sessions.session_id, sessionId)).execute()
}
