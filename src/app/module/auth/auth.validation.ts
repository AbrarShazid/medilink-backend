import z from "zod";

export const registerPatientZodSchema = z.object({
  name: z
    .string("Name must be string")
    .min(2, "Name should be atleast 2 character"),
  email: z.email("Invalid email format"),
  password: z
    .string("Password must be a string")
    .min(8, "Password minimum length is 8 characters"),
});

export const logInZodSchema = z.object({
  email: z.email("Invalid email format "),
  password: z
    .string("Password must be a string")
    .min(8, "Password minimum length is 8 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string("Password must be a string")
    .min(8, "Password minimum length is 8 characters"),
  newPassword: z
    .string("Password must be a string")
    .min(8, "Password minimum length is 8 characters"),
});
