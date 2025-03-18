import * as pino from "pino";
import { logger as honoLogger } from "hono/logger";
import "dotenv/config";

const stdOutTransport = {
  target: "pino/file",
};

const transports = pino.transport({
  targets: [stdOutTransport],
});
const logger = pino.pino(transports);

const customLogger = (message: string, ...rest: string[]) => {
  logger.debug(message, ...rest);
};

const loggerMiddleware = () => honoLogger(customLogger);

export { loggerMiddleware, logger };
