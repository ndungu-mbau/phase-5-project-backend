import { z } from 'zod'
import { Hono } from 'hono'
import { db, visits } from '../../db'
import { eq } from 'drizzle-orm'
import { authenticate, authorize } from '../../auth/middleware'

const visitsRouter = new Hono()

// Zod schema for validation
const visitSchema = z.object({
  visit_date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  user_id: z.string().uuid(),
  home_id: z.string().uuid().optional(),
})

// Create a new visit
visitsRouter.post(
  '/',
  authenticate,
  authorize('visits', 'createAny'),
  async c => {
    const body = await c.req.json()
    const parsed = visitSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: parsed.error.errors }, 400)
    }
    const newVisit = await db.insert(visits).values(parsed.data)
    return c.json(newVisit, 201)
  }
)

// Read all visits with pagination
visitsRouter.get('/', authenticate, authorize('visits', 'readAny'), async c => {
  const page = parseInt(c.req.query('page') || '1', 10)
  const limit = parseInt(c.req.query('limit') || '10', 10)
  const offset = (page - 1) * limit

  const visitsList = await db.select().from(visits).limit(limit).offset(offset)

  const totalVisits = await db.select().from(visits)

  return c.json({
    total: totalVisits.length,
    page,
    limit,
    visits: visitsList,
  })
})

// Read a single visit by ID
visitsRouter.get(
  '/:id',
  authenticate,
  authorize('visits', 'readAny'),
  async c => {
    const { id } = c.req.param()
    const [visit] = await db
      .select()
      .from(visits)
      .where(eq(visits.visit_id, id))
      .limit(1)

    if (!visit) {
      return c.json({ error: 'Visit not found' }, 404)
    }
    return c.json(visit)
  }
)

// Update a visit by ID
visitsRouter.put(
  '/:id',
  authenticate,
  authorize('visits', 'updateAny'),
  async c => {
    const { id } = c.req.param()
    const body = await c.req.json()
    const parsed = visitSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: parsed.error.errors }, 400)
    }
    const updatedVisit = await db
      .update(visits)
      .set(parsed.data)
      .where(eq(visits.visit_id, id))
    return c.json(updatedVisit)
  }
)

// Delete a visit by ID
visitsRouter.delete(
  '/:id',
  authenticate,
  authorize('visits', 'deleteAny'),
  async c => {
    const { id } = c.req.param()
    await db.delete(visits).where(eq(visits.visit_id, id))
    return c.json({ message: 'Visit deleted' })
  }
)

export { visitsRouter }
