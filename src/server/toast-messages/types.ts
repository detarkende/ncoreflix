import { z } from 'zod';

export const toastMessageTypeSchema = z.enum([
	'error',
	'success',
	'info',
	'warning',
]);

export const toastMessageSchema = z.object({
	type: toastMessageTypeSchema,
	message: z.string(),
});

export const toastMessageArraySchema = z.array(toastMessageSchema);

export type ToastMessageType = z.infer<typeof toastMessageTypeSchema>;

export type ToastMessage = z.infer<typeof toastMessageSchema>;

export const isToastMessage = (data: unknown): data is ToastMessage => {
	const { success } = toastMessageSchema.safeParse(data);
	return success;
};
