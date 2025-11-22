import { z } from "zod";

export const createUserSchema = z.object({
    body: z.object({
        name: z.string(),
        email: z.string(),
        age: z.number(),
    }),
});

// User registration schema
export const registerUserSchema = z.object({
    body: z.object({
        firstName: z.string().min(2, "Name must be at least 2 characters"),
        lastName: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string(),
        // password: z.string().min(6, "Password must be at least 6 characters"),
        internalCompany: z.array(z.number()),
        role: z.number("Role is required"),
        mobileNumber: z
            .string()
            .min(10, "Mobile number must be at least 10 digits"),
    }),
});

// User login schema
export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});

// User update schema
export const updateUserSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .optional(),
        email: z.string().email("Invalid email address").optional(),
        age: z.number().min(18, "Must be at least 18 years old").optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid user ID"),
    }),
});

// Extract TypeScript types from schemas
export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type RegisterUserInput = z.infer<typeof registerUserSchema>["body"];
export type LoginUserInput = z.infer<typeof loginUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];

export default createUserSchema;
