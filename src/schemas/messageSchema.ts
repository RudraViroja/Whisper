import {z} from 'zod'

export const messageSchema = z.object({
    content: z
        .string()
        .min(5, {message: "Content must be of atleast 5 characters"})
        .max(600, {message: "Content must not be more than 600 characters"})
})