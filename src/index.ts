import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./api";

serve(app);
