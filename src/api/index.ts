import 'dotenv/config'
import { Hono } from 'hono'

import { homes } from './homes'
import { donationsRouter } from './donations'
import { visitsRouter } from './visits'
import { reviewsRouter } from './reviews'

const app = new Hono().basePath('/api')

const setupRoutes = () => {
  app.get('/', c => c.text('Hono!'))
  app.route('/homes', homes)
  app.route('/donations', donationsRouter)
  app.route('/visits', visitsRouter)
  app.route('/reviews', reviewsRouter)
}

export { app, setupRoutes }
