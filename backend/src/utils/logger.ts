import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ceekay-dashboard-api' },
  // Serverless filesystems are read-only, so skip file logs on Vercel
  transports: process.env.VERCEL
    ? [new winston.transports.Console()]
    : [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}
