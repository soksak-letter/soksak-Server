import { z } from "zod";
import { idParamPart } from "./common.schema.js";

// ========== Notice Schema ==========
export const noticeIdParamSchema = z.object({
  params: z.object({
    noticeId: idParamPart
  })
});
