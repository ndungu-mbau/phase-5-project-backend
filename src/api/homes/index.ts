import { z } from "zod";
import { Hono } from "hono";
import { db, childrensHomes } from "../../db";
import { eq } from "drizzle-orm";

const homes = new Hono();

// Zod schema for validation
const childrensHomeSchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().max(255).optional(),
  description: z.string().optional(),
  contact_information: z.string().optional(),
  needs: z.string().optional(),
});

// Create a new children's home
homes.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = childrensHomeSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400);
  }
  const newHome = await db.insert(childrensHomes).values(parsed.data);
  return c.json(newHome, 201);
});

// Read all children's homes with pagination
homes.get("/", async (c) => {
  const page = parseInt(c.req.query("page") || "1", 10);
  const limit = parseInt(c.req.query("limit") || "10", 10);
  const offset = (page - 1) * limit;

  const homes = await db
    .select()
    .from(childrensHomes)
    .limit(limit)
    .offset(offset);

  const totalHomes = await db.select().from(childrensHomes);

  return c.json({
    total: totalHomes.length,
    page,
    limit,
    homes,
  });
});

// Read a single children's home by ID
homes.get("/:id", async (c) => {
  const { id } = c.req.param();
  const [home] = await db
    .select()
    .from(childrensHomes)
    .where(eq(childrensHomes.home_id, id))
    .limit(1);

  if (!home) {
    return c.json({ error: "Home not found" }, 404);
  }
  return c.json(home);
});

// Update a children's home by ID
homes.put("/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const parsed = childrensHomeSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400);
  }
  const updatedHome = await db
    .update(childrensHomes)
    .set(parsed.data)
    .where(eq(childrensHomes.home_id, id));
  return c.json(updatedHome);
});

// Delete a children's home by ID
homes.delete("/:id", async (c) => {
  const { id } = c.req.param();
  await db.delete(childrensHomes).where(eq(childrensHomes.home_id, id));
  return c.json({ message: "Home deleted" });
});

export { homes };
