import 'dotenv/config'
import { Hono } from 'hono'

import { homes } from './homes'
import { donationsRouter } from './donations'
import { visitsRouter } from './visits'

const app = new Hono().basePath('/api')

const setupRoutes = () => {
  app.get('/', c => c.text('Hono!'))
  app.route('/homes', homes)
  app.route('/donations', donationsRouter)
  app.route('/visits', visitsRouter)
}

export { app, setupRoutes }
