import { z } from "zod";

export const number = z.coerce.number().transform((val) => Number(val));
export const hidden = z.coerce.string().optional().nullable();
