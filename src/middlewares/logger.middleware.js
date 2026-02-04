import morgan from "morgan";
import logger from "../configs/logger.config.js";
import { maskSensitiveData } from "../utils/mask.util.js";

const logFormat = (tokens, req, res) => {
    const query = maskSensitiveData(req.query || {});
    const body = maskSensitiveData(req.body || {});
    const errorPart = res.locals.errorMessage ? `\n  > Error: ${res.locals.errorMessage}` : '';

    return [
        `[${tokens.method(req, res)}]`,
        tokens.url(req, res),
        '| Status:', tokens.status(req, res),
        '| Time:', tokens['response-time'](req, res), 'ms',
        errorPart,
        '\n  > Query:', Object.keys(query).length ? JSON.stringify(query) : '{}',
        '\n  > Body:', Object.keys(body).length ? JSON.stringify(body) : '{}',
        '\n  > Headers:', JSON.stringify({
            'content-type': req.headers['content-type'],
            'authorization': req.headers['authorization'] ? 'Present' : 'None'
        })
    ].join(' ');
}

const stream = {
    write: (message) => {
        const msg = message.trim();

        const statusMatch = msg.match(/Status: (\d+)/);
        const status = statusMatch ? parseInt(statusMatch[1]) : 0;

        if (status >= 500) {
            logger.error(msg);
        } else if (status >= 400) {
            logger.warn(msg);
        } else {
            logger.info(msg);
        }
    }
}

const httpLogger = morgan(logFormat, { stream });

export default httpLogger;