import { db } from "@/db/index.js";
import { playerTable } from "@/db/schema/player.js";
import { logger } from "@/lib/logger.js";
import { and, eq, gte, lte, SQL } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono();

/**
 * GET /players
 *
 * Retrieves a list of players from the database based on the provided query parameters.
 *
 * Query Parameters:
 * - `role` (optional): Filters players by their role.
 * - `isActive` (optional): Filters players by their active status. Accepts "true" or "false".
 * - `club` (optional): Filters players by their club.
 * - `birthDateMin` (optional): Filters players born on or after the specified date (ISO 8601 format).
 * - `birthDateMax` (optional): Filters players born on or before the specified date (ISO 8601 format).
 *
 * Response:
 * - Returns a JSON array of player objects that match the specified filters.
 *
 * Example:
 * ```
 * GET /players?role=forward&isActive=true&club=FCB&birthDateMin=1990-01-01&birthDateMax=2000-12-31
 * ```
 *
 * Notes:
 * - If no query parameters are provided, all players will be returned.
 * - The `isActive` parameter is case-sensitive and must be "true" or "false".
 */
app.get("/players", async (c) => {
  const { role, isActive, club, birthDateMin, birthDateMax } = c.req.query();
  logger.info("Received request to fetch players");

  const filters: SQL[] = [];

  if (role) {
    filters.push(eq(playerTable.role, role));
  }

  if (isActive !== undefined) {
    filters.push(eq(playerTable.isActive, isActive === "true"));
  }

  if (club) {
    filters.push(eq(playerTable.club, club));
  }

  if (birthDateMin) {
    filters.push(gte(playerTable.birthDate, new Date(birthDateMin)));
  }

  if (birthDateMax) {
    filters.push(lte(playerTable.birthDate, new Date(birthDateMax)));
  }

  const players = await db.query.playerTable.findMany({
    where: and(...filters),
  });

  return c.json(players);
});

export default app;
