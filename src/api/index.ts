import "dotenv/config";
import { Hono } from "hono";

import { homes } from "./homes";

const app = new Hono().basePath("/api");

app.get("/", (c) => c.text("Hono!"));
app.route("/homes", homes);

export { app };
