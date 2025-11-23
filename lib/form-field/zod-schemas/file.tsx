import { z } from "zod";

export const file = z.object({
	file: z.instanceof(File).optional(),
	id: z.string().optional(),
	preview: z.string().optional(),
});

export const oneOrManyFile = z.union([file, z.array(file)]).optional();
export type OneOrManyFile = z.infer<typeof oneOrManyFile>;
