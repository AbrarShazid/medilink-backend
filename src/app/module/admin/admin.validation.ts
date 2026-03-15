import z from "zod";

export const validateAdminUpdatePayload = z.object({
  admin: z
    .object({
      name: z
        .string("Name Must be string")
        .min(2, "Minimum 2 character needed")
        .optional(),
      profilePhoto: z.url("Profile photo must be a valid URL").optional(),
      contactNumber: z
        .string("Contact number must be a string")
        .min(11, "Contact number must be at least 11 characters")
        .max(14, "Contact number must be at most 15 characters")
        .optional(),
    })
    .optional(),
});
