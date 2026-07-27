import {email, z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 charachters long")
    .max(20, "Username must not be longer than 20 charachters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special charcters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be atleast 6 characters long"})
})