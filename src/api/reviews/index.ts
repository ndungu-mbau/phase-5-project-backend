import { z } from 'zod'
import { Hono } from 'hono'
import { db, reviews } from '../../db'
import { eq } from 'drizzle-orm'

const reviewsRouter = new Hono()

// Zod schema for validation
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  user_id: z.string().uuid(),
  home_id: z.string().uuid().optional(),
})

// Create a new review
reviewsRouter.post('/', async c => {
  const body = await c.req.json()
  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400)
  }
  const newReview = await db.insert(reviews).values(parsed.data)
  return c.json(newReview, 201)
})

// Read all reviews with pagination
reviewsRouter.get('/', async c => {
  const page = parseInt(c.req.query('page') || '1', 10)
  const limit = parseInt(c.req.query('limit') || '10', 10)
  const offset = (page - 1) * limit

  const reviewsList = await db
    .select()
    .from(reviews)
    .limit(limit)
    .offset(offset)

  const totalReviews = await db.select().from(reviews)

  return c.json({
    total: totalReviews.length,
    page,
    limit,
    reviews: reviewsList,
  })
})

// Read a single review by ID
reviewsRouter.get('/:id', async c => {
  const { id } = c.req.param()
  const [review] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.review_id, id))
    .limit(1)

  if (!review) {
    return c.json({ error: 'Review not found' }, 404)
  }
  return c.json(review)
})

// Update a review by ID
reviewsRouter.put('/:id', async c => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400)
  }
  const updatedReview = await db
    .update(reviews)
    .set(parsed.data)
    .where(eq(reviews.review_id, id))
  return c.json(updatedReview)
})

// Delete a review by ID
reviewsRouter.delete('/:id', async c => {
  const { id } = c.req.param()
  await db.delete(reviews).where(eq(reviews.review_id, id))
  return c.json({ message: 'Review deleted' })
})

export { reviewsRouter }
