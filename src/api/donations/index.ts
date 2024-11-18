import { z } from 'zod'
import { Hono } from 'hono'
import { db, donations } from '../../db'
import { eq } from 'drizzle-orm'

const donationsRouter = new Hono()

// Zod schema for validation
const donationSchema = z.object({
  amount: z.string(),
  donation_date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  user_id: z.string().uuid(),
  home_id: z.string().uuid().optional(),
})

// Create a new donation
donationsRouter.post('/', async c => {
  const body = await c.req.json()
  const parsed = donationSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400)
  }
  const newDonation = await db.insert(donations).values(parsed.data)
  return c.json(newDonation, 201)
})

// Read all donations with pagination
donationsRouter.get('/', async c => {
  const page = parseInt(c.req.query('page') || '1', 10)
  const limit = parseInt(c.req.query('limit') || '10', 10)
  const offset = (page - 1) * limit

  const donationsList = await db
    .select()
    .from(donations)
    .limit(limit)
    .offset(offset)

  const totalDonations = await db.select().from(donations)

  return c.json({
    total: totalDonations.length,
    page,
    limit,
    donations: donationsList,
  })
})

// Read a single donation by ID
donationsRouter.get('/:id', async c => {
  const { id } = c.req.param()
  const [donation] = await db
    .select()
    .from(donations)
    .where(eq(donations.donation_id, id))
    .limit(1)

  if (!donation) {
    return c.json({ error: 'Donation not found' }, 404)
  }
  return c.json(donation)
})

// Update a donation by ID
donationsRouter.put('/:id', async c => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const parsed = donationSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400)
  }
  const updatedDonation = await db
    .update(donations)
    .set(parsed.data)
    .where(eq(donations.donation_id, id))
  return c.json(updatedDonation)
})

// Delete a donation by ID
donationsRouter.delete('/:id', async c => {
  const { id } = c.req.param()
  await db.delete(donations).where(eq(donations.donation_id, id))
  return c.json({ message: 'Donation deleted' })
})

export { donationsRouter }
