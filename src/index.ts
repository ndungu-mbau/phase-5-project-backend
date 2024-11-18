import 'dotenv/config'
import { serve } from '@hono/node-server'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { app, setupRoutes } from './api'

app.use(cors())
app.use(logger())

setupRoutes()

serve(app)
