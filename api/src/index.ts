import { serve } from "@hono/node-server";
import { Hono } from "hono";
import players from "@/routes/players.js";
import { HTTPException } from "hono/http-exception";
import { logger, loggerMiddleware } from "@/lib/logger.js";

const app = new Hono();

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    logger.error(`Handled, ${err.message}`);
    return err.getResponse();
  } else {
    logger.error(`Unhandled, Message: ${err.message}, Stack: ${err.stack}`);
    return new HTTPException(500, {
      message: JSON.stringify({ message: `Unhandled error` }),
      cause: err,
    }).getResponse();
  }
});

app.use("*", loggerMiddleware());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api", players);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    logger.info(`Server is running on http://localhost:${info.port}`);
  }
);
