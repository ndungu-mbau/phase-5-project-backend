import 'dotenv/config'
import { Hono } from 'hono'

import { homes } from './homes'
import { donationsRouter } from './donations'

const app = new Hono().basePath('/api')

const setupRoutes = () => {
  app.get('/', c => c.text('Hono!'))
  app.route('/homes', homes)
  app.route('/donations', donationsRouter)
}

export { app, setupRoutes }
