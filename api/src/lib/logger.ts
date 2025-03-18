import * as pino from "pino";
import { logger as honoLogger } from "hono/logger";
import "dotenv/config";

const stdOutTransport = {
  target: "pino/file",
};

const fileTransport = {
  target: "pino/file",
  options: { destination: "./app.log" },
};

const transports = pino.transport({
  targets: [stdOutTransport, fileTransport],
});
const logger = pino.pino(transports);


const customLogger = (message: string, ...rest: string[]) => {
  logger.debug(message, ...rest);
};

const loggerMiddleware = () => honoLogger(customLogger);

export { loggerMiddleware, logger };
