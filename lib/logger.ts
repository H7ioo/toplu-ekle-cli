import winston, { format } from "winston";
import "winston-daily-rotate-file";
import * as path from "path";
import { env } from "./env";

const {
  label,
  json,
  combine,
  colorize,
  timestamp,
  align,
  printf,
  errors,
  metadata,
} = format;

const errorFilter = winston.format((info) => {
  return info.level === "error" ? info : false;
});

const infoFilter = winston.format((info) => {
  return info.level === "info" ? info : false;
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL ?? "info",
  format: combine(
    errors({ stack: true }),
    label({ label: path.basename(require.main?.filename ?? "UNKNOWN") }),
    timestamp({
      format: "DD-MM-YY hh:mm:ss A", // 2022-01-25 03:23:10 PM
    }),
    json(),
    // Format the metadata object
    metadata({
      fillExcept: ["message", "level", "timestamp", "label", "stack"],
    })
  ),

  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "DD-MM-YY hh:mm:ss A",
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: "all-%DATE%.log",
      dirname: "logs",
      datePattern: "DD-MM-YY",
      maxFiles: "7d",
      format: combine(json()),
    }),
    new winston.transports.DailyRotateFile({
      filename: "error-%DATE%.log",
      level: "error",
      format: combine(errorFilter(), json()),
      dirname: "logs",
      datePattern: "DD-MM-YY",
      maxFiles: "7d",
    }),
    new winston.transports.DailyRotateFile({
      filename: "info-%DATE%.log",
      level: "info",
      format: combine(infoFilter(), json()),
      dirname: "logs",
      datePattern: "DD-MM-YY",
      maxFiles: "7d",
    }),
  ],
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: "exception-%DATE%.log",
      format: combine(json()),
      dirname: "logs",
      datePattern: "DD-MM-YY",
      maxFiles: "7d",
    }),
  ],
  rejectionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: "rejection-%DATE%.log",
      format: combine(json()),
      dirname: "logs",
      datePattern: "DD-MM-YY",
      maxFiles: "7d",
    }),
  ],
});

// // fired when a log file is created
// fileRotateTransport.on("new", (filename) => {});
// // fired when a log file is rotated
// fileRotateTransport.on("rotate", (oldFilename, newFilename) => {});
// // fired when a log file is archived
// fileRotateTransport.on("archive", (zipFilename) => {});
// // fired when a log file is deleted
// fileRotateTransport.on("logRemoved", (removedFilename) => {});
