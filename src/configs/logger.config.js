import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logDir = "logs";

const logFormat = winston.format.combine(
    winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
    winston.format.printf((info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`))
)

const logLevels = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3,
};

const logger = winston.createLogger({
    level: "debug",
    levels: logLevels,
    format: logFormat,
    transports: [
        new DailyRotateFile({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: path.join(logDir, 'error'),
            filename: '%DATE%.error.log',
            maxFiles: 14, 
            zippedArchive: true,
            handleExceptions: true
        }),
        new DailyRotateFile({
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: path.join(logDir, 'combined'),
            filename: '%DATE%.combined.log',
            maxFiles: 7, 
            zippedArchive: true
        })
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

export default logger;