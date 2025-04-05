import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
const loggerFormat = winston.format.combine(
  winston.format.simple(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss Z'
  }),
  winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
)
const transportInfo: DailyRotateFile = new DailyRotateFile({
  dirname: 'logs',
  filename: 'app-%DATE%.log.info',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxFiles: '1d',
  maxSize: '20m',
  level: 'info',
  format: winston.format((info) => (info.level === 'info' ? info : false))()
})
const transportError: DailyRotateFile = new DailyRotateFile({
  dirname: 'logs',
  filename: 'error-%DATE%.log.error',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxFiles: '1d',
  maxSize: '20m',
  level: 'error'
})
const logger = winston.createLogger({
  level: 'debug',
  format: loggerFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), loggerFormat)
    }),
    transportInfo,
    transportError
  ]
})

export default logger

// error -> warn -> info -> http -> verbose -> debug -> silly
