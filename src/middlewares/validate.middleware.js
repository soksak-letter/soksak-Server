import { BadRequestError } from "../errors/base.error.js";
import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            params: req.params ?? {},
            query: req.query ?? {},
            body: req.body ?? {},
        });

        req.params = parsed.params;
        req.query = parsed.query;
        req.body = parsed.body;
        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errorDetails = err.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message
            }))

            const validationError = new BadRequestError("REQ_BAD_REQUEST", "입력값이 잘못되었습니다", errorDetails);

            return next(validationError);
        }
        next(err);
    }
}