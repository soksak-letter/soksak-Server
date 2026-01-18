import e from "cors";
import { BadRequestError } from "../errors/base.error.js";
import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
    try{
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        })

        next();
    } catch(err) {
        if(err instanceof z.ZodError){
            console.log(err);
            const errorDetails = err.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message
            }))

            const validationError = new BadRequestError("INVALID_TYPE_400", "입력값이 잘못되었습니다", errorDetails);
            
            return next(validationError);
        }
        next(err);
    }
}