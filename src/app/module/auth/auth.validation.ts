import z from "zod";

export const registerPatientZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name should be atleast 2 character" }),
  email: z.email({ message: "Invalid email format" }),
  password: z
    .string({ message: "Password must be a string" })
    .min(8, { message: "Password minimum length is 8 characters" }),
});

export const logInZodSchema = z.object({
  email: z.email({ message: "Invalid email format " }),
  password: z
    .string({ message: "Password must be a string" })
    .min(8, { message: "Password minimum length is 8 characters" }),
});
