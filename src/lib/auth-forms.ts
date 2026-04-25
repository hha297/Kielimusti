import { z } from "zod";

export const signUpFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email"),
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9._]+$/, "Only letters, numbers, dots, and underscores"),
  password: z.string().min(8, "At least 8 characters").max(128),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export const signInFormSchema = z.object({
  emailOrUsername: z.string().trim().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;
